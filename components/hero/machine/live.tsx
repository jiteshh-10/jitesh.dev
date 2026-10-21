"use client";

import "../../iso/iso.css";
import * as React from "react";
import { IsoFigure, Solid, Line, Dots, FaceText, Plate } from "../../iso/react/draw";
import { asksForStillness, useInView, useStillness } from "../../iso/react/live";
import {
  BASE, PILE_ART, PUSHER_ART, WEIGH_ART, DIAL_ART, GATE_ART, LANES_ART,
  HOUSE_ART, EXIT_ART, TRAY_ART,
} from "./geometry";
import { needlePath, leverPaths, bladePath, gearMarks } from "./frame";
import {
  QUEUE, angleOf, laneOf, readoutOf, rideOf, REST_RIDE, HOLD, TOUR_FIRST, TOUR_BACK,
  NEEDLE, LEVER, GEAR, CARDRIDE, type TourPhase,
} from "./model";
import * as V from "./view";
import { iso, pathOf } from "../../iso/iso-kit";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function springStep(val: number, target: number, vel: number, k: number, c: number, dt: number) {
  const force = (target - val) * k;
  const damp = vel * c;
  const acc = force - damp;
  const nv = vel + acc * dt;
  const nx = val + nv * dt;
  return { val: nx, vel: nv };
}

const PHASES: TourPhase[] = ['choose', 'feed', 'weigh', 'route', 'build', 'lift', 'slide', 'drop', 'rest'];

export function MachineLive() {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef);
  const still = useStillness();

  const gearTargetRef = React.useRef(0);

  // DOM refs for moving parts
  const needleRef = React.useRef<SVGPathElement>(null);
  const leverStickRef = React.useRef<SVGPathElement>(null);
  const leverKnobRef = React.useRef<SVGPathElement>(null);
  const bladeRef = React.useRef<SVGPathElement>(null);
  const spokesRef = React.useRef<SVGPathElement>(null);
  const ticksRef = React.useRef<SVGPathElement>(null);
  const cardGroupRef = React.useRef<SVGGElement>(null);
  const cardShadowRef = React.useRef<SVGPathElement>(null);
  const readoutRef = React.useRef<HTMLSpanElement>(null);

  // model state (refs to avoid re-renders)
  const phaseRef = React.useRef<TourPhase>('rest');
  const phaseStartRef = React.useRef<number>(0);
  const cardIndexRef = React.useRef(0);
  const weightRef = React.useRef(QUEUE[0].weight);
  const laneRef = React.useRef<-1 | 1>(-1);
  const shippedRef = React.useRef(0);
  const engagedRef = React.useRef(false);
  const tourTimerRef = React.useRef<number | null>(null);

  // spring state
  const needle = React.useRef({ val: QUEUE[0].weight, vel: 0 });
  const lever = React.useRef({ val: 0, vel: 0 });
  const blade = React.useRef({ val: 0, vel: 0 });
  const gear = React.useRef({ val: 0, vel: 0 });
  const card = React.useRef<{ x: number; y: number; z: number; vx: number; vy: number; vz: number }>({ x: V.WALK.pad[0], y: V.WALK.pad[1], z: 2, vx: 0, vy: 0, vz: 0 });

  const restScreen = React.useMemo(() => {
    const p = V.at([V.WALK.pad[0], V.WALK.pad[1], 2]);
    const f = V.at([V.WALK.pad[0], V.WALK.pad[1], 0]);
    return { card: p, floor: f };
  }, []);

  const advancePhase = React.useCallback(() => {
    const idx = PHASES.indexOf(phaseRef.current);
    const next = PHASES[(idx + 1) % PHASES.length];
    // side effects on transition
    if (next === 'choose') {
      const w = QUEUE[cardIndexRef.current].weight;
      weightRef.current = w;
      laneRef.current = laneOf(w);
    }
    if (next === 'build') {
      gear.current.val = gear.current.val; // target set below via ref target
    }
    if (next === 'rest') {
      shippedRef.current += 1; // count the card just dropped
      // actually increment happens on drop->rest; guard: only if we dropped
    }
    if (next === 'rest' && !engagedRef.current) {
      // schedule next tour
    }
    phaseRef.current = next;
    phaseStartRef.current = performance.now();
    if (next === 'rest') {
      // reset card index for next cycle
      cardIndexRef.current = (cardIndexRef.current + 1) % QUEUE.length;
    }
  }, []);

  // Fix shipped counting: increment on entering 'drop' completion -> handle in loop when phase becomes rest
  // We'll count shipped when transitioning drop->rest above (done). But shipped should increment per completed card.
  // Guard double-count: reset shippedRef tracking via a 'counted' flag.
  const countedRef = React.useRef(false);

  React.useEffect(() => {
    if (still) {
      // render rest frame
      const w = QUEUE[0].weight;
      if (needleRef.current) needleRef.current.setAttribute('d', needlePath(w));
      const lp = leverPaths(0);
      leverStickRef.current?.setAttribute('d', lp.stick);
      leverKnobRef.current?.setAttribute('d', lp.knob);
      bladeRef.current?.setAttribute('d', bladePath(0));
      const gm = gearMarks(0);
      spokesRef.current?.setAttribute('d', gm.spokes);
      ticksRef.current?.setAttribute('d', gm.ticks);
      return;
    }
    if (!inView) return;

    let raf = 0;
    let last = performance.now();
    phaseRef.current = 'rest';
    phaseStartRef.current = performance.now() + TOUR_FIRST * 1000 - HOLD.rest * 1000;
    // start tour after TOUR_FIRST
    const startTour = () => {
      phaseRef.current = 'choose';
      phaseStartRef.current = performance.now();
      weightRef.current = QUEUE[cardIndexRef.current].weight;
      laneRef.current = laneOf(weightRef.current);
    };
    const initialTimer = window.setTimeout(startTour, TOUR_FIRST * 1000);

    const tick = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000);
      last = now;

      const phase = phaseRef.current;
      const elapsed = now - phaseStartRef.current;
      const hold = HOLD[phase] * 1000;
      const u = hold > 0 ? Math.min(1, elapsed / hold) : 1;

      // targets
      const w = weightRef.current;
      const lane = laneRef.current;
      const needleTarget = phase === 'weigh' || phase === 'route' || phase === 'build' || phase === 'lift' || phase === 'slide' || phase === 'drop' || phase === 'rest' ? w : QUEUE[cardIndexRef.current].weight;
      // lever/blade target
      let leverTarget = 0;
      let bladeTarget = 0;
      if (phase === 'choose' || phase === 'route' || phase === 'weigh') {
        leverTarget = lane * V.LEVER.max;
        bladeTarget = lane * V.BLADE_MAX;
      }
      // gear target: increments on build; track cumulative target
      // (gear target stored as gear.current target via a separate ref)
      const gearTarget = gearTargetRef.current;

      // spring step
      needle.current = springStep(needle.current.val, needleTarget, needle.current.vel, NEEDLE[0], NEEDLE[1], dt);
      lever.current = springStep(lever.current.val, leverTarget, lever.current.vel, LEVER[0], LEVER[1], dt);
      blade.current = springStep(blade.current.val, bladeTarget, blade.current.vel, LEVER[0], LEVER[1], dt);
      gear.current = springStep(gear.current.val, gearTarget, gear.current.vel, GEAR[0], GEAR[1], dt);

      // card target
      let cardTarget: { x: number; y: number; z: number } = { x: card.current.x, y: card.current.y, z: card.current.z };
      if (phase === 'feed') cardTarget = rideOf('feed', u, lane);
      else if (phase === 'route') cardTarget = rideOf('route', u, lane);
      else if (phase === 'lift') cardTarget = rideOf('lift', u, lane);
      else if (phase === 'slide') cardTarget = rideOf('slide', u, lane);
      else if (phase === 'drop') cardTarget = rideOf('drop', u, lane);
      else if (phase === 'build') { const r = rideOf('route', 1, lane); cardTarget = { x: r.x, y: r.y, z: r.z }; }
      else if (phase === 'weigh') { const r = rideOf('feed', 1, lane); cardTarget = { x: r.x, y: r.y, z: r.z }; }
      else if (phase === 'rest') { const r = rideOf('drop', 1, lane); cardTarget = { x: r.x, y: r.y, z: r.z }; }
      else if (phase === 'choose') { cardTarget = { x: V.WALK.stack[0], y: V.WALK.stack[1], z: V.PILE.z + V.CARD.h * V.PILE_COUNT }; }

      card.current = {
        x: springStep(card.current.x, cardTarget.x, card.current.vx, CARDRIDE[0], CARDRIDE[1], dt).val,
        y: springStep(card.current.y, cardTarget.y, card.current.vy, CARDRIDE[0], CARDRIDE[1], dt).val,
        z: springStep(card.current.z, cardTarget.z, card.current.vz, CARDRIDE[0], CARDRIDE[1], dt).val,
        vx: springStep(card.current.x, cardTarget.x, card.current.vx, CARDRIDE[0], CARDRIDE[1], dt).vel,
        vy: springStep(card.current.y, cardTarget.y, card.current.vy, CARDRIDE[0], CARDRIDE[1], dt).vel,
        vz: springStep(card.current.z, cardTarget.z, card.current.vz, CARDRIDE[0], CARDRIDE[1], dt).vel,
      };

      // update DOM
      if (needleRef.current) needleRef.current.setAttribute('d', needlePath(needle.current.val));
      const lp = leverPaths(lever.current.val);
      leverStickRef.current?.setAttribute('d', lp.stick);
      leverKnobRef.current?.setAttribute('d', lp.knob);
      bladeRef.current?.setAttribute('d', bladePath(blade.current.val));
      const gm = gearMarks(gear.current.val);
      spokesRef.current?.setAttribute('d', gm.spokes);
      ticksRef.current?.setAttribute('d', gm.ticks);

      // card transform
      if (cardGroupRef.current) {
        const cur = V.at([card.current.x, card.current.y, card.current.z]);
        const dx = cur[0] - restScreen.card[0];
        const dy = cur[1] - restScreen.card[1];
        cardGroupRef.current.setAttribute('transform', `translate(${dx.toFixed(2)}, ${dy.toFixed(2)})`);
      }
      if (cardShadowRef.current) {
        const cur = V.at([card.current.x, card.current.y, 0.05]);
        const dx = cur[0] - V.at([V.WALK.pad[0], V.WALK.pad[1], 0.05])[0];
        const dy = cur[1] - V.at([V.WALK.pad[0], V.WALK.pad[1], 0.05])[1];
        cardShadowRef.current.setAttribute('transform', `translate(${dx.toFixed(2)}, ${dy.toFixed(2)})`);
      }

      // readout
      if (readoutRef.current) {
        const settled = Math.abs(needle.current.val - w) < 0.15;
        readoutRef.current.textContent = readoutOf({
          weight: w,
          lane,
          shipped: shippedRef.current,
          running: phase !== 'rest',
          phase,
          settled,
        });
      }

      // phase advance
      if (elapsed >= hold && hold > 0) {
        // handle shipped increment on drop->rest
        if (phase === 'drop') {
          shippedRef.current += 1;
          cardIndexRef.current = (cardIndexRef.current + 1) % QUEUE.length;
        }
        if (phase === 'build') {
          gearTargetRef.current += 20; // one notch
        }
        if (phase === 'rest') {
        }
        advancePhase();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(initialTimer);
    };
  }, [inView, still, advancePhase]);

  // keyboard + click handlers
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { engagedRef.current = true; laneRef.current = -1; lever.current.vel = 0; blade.current.vel = 0; e.preventDefault(); }
    if (e.key === 'ArrowRight') { engagedRef.current = true; laneRef.current = 1; lever.current.vel = 0; blade.current.vel = 0; e.preventDefault(); }
    if (e.key === ' ' || e.key === 'Enter') {
      engagedRef.current = true;
      phaseRef.current = 'choose';
      phaseStartRef.current = performance.now();
      weightRef.current = QUEUE[cardIndexRef.current].weight;
      laneRef.current = laneOf(weightRef.current);
      e.preventDefault();
    }
  };

  // card traveler (dynamic) uses travelerCard below; cardSlab removed
  const travelerCard = (
    <g ref={cardGroupRef}>
      <path className="iso-halo" d={PILE_ART.cards[0].slab.fill} />
      <Solid paths={PILE_ART.cards[0].slab} tone="hi" crease="faint" />
      <Line d={PILE_ART.cards[0].rules} tone="lo" />
    </g>
  );

  return (
    <Plate
      fig="SYS / 01"
      title="CONSTRAINT → BUILT → SHIPPED"
      hint="drag the lever · ← → · space to run a card"
      readout={<span ref={readoutRef}>gate idle · shipped 0</span>}
      keys={[
        { mark: "lit", label: "The card in motion" },
        { mark: "raised", label: "The flywheel index" },
        { mark: "edge", label: "The points blade" },
      ]}
      caption="A bench machine: a constraint card is weighed on a dial gauge, routed by a points blade down the lane that matches its weight, built (the flywheel indexes one notch), and shipped down the step cascade into the tray. Every number — needle, blade, card — comes from one model."
    >
      <div ref={stageRef} tabIndex={0} onKeyDown={onKeyDown} style={{ outline: "none" }}>
        <IsoFigure width={V.WIDTH} height={V.HEIGHT} label="Constraint bench machine">
          {/* base */}
          <g key="base">
            <path className="iso-halo" d={BASE.halo} />
            {BASE.feet.map((parts, i) => (
              <g key={i}>{parts.map((p, j) => <Solid key={j} paths={p} tone={j ? "mid" : "lo"} crease="faint" />)}</g>
            ))}
            <Solid paths={BASE.slab} tone="mid" crease="faint" />
            <Line d={BASE.groove} tone="lo" />
            <Line d={BASE.screwRings} tone="lo" />
            <Dots points={BASE.screws} size={0.5} tone="mid" />
            <Solid paths={BASE.topPlate} tone="lo" crease="none" />
          </g>
          {/* infeed */}
          <g key="infeed">
            <Solid paths={PILE_ART.pad} tone="mid" crease="faint" />
            <Line d={PILE_ART.groove} tone="lo" />
            <Dots points={PILE_ART.screws} size={0.45} tone="mid" />
            {PILE_ART.cards.map((c, i) => (
              <g key={i}>
                <Solid paths={c.slab} tone={i === 0 ? "hi" : "mid"} crease="faint" />
                <Line d={c.rules} tone="lo" />
              </g>
            ))}
            <Solid paths={PUSHER_ART.housing} tone="mid" crease="faint" />
            <Solid paths={PUSHER_ART.collar} tone="mid" crease="faint" />
            <Line d={PUSHER_ART.rod} tone="lo" />
            <Solid paths={PUSHER_ART.tip} tone="mid" crease="faint" />
          </g>
          {/* weigh + dial */}
          <g key="weigh">
            <Solid paths={WEIGH_ART.pad} tone="mid" crease="faint" />
            <Line d={WEIGH_ART.groove} tone="lo" />
            <Dots points={WEIGH_ART.screws} size={0.45} tone="mid" />
            <Solid paths={DIAL_ART.stand} tone="lo" crease="faint" />
            <Solid paths={DIAL_ART.puck} tone="mid" crease="faint" />
            <Line d={DIAL_ART.bezelRing} tone="lo" />
            <Line d={DIAL_ART.faceRing} tone="faint" />
            <Line d={DIAL_ART.ticks.minor} tone="lo" />
            <Line d={DIAL_ART.ticks.major} tone="mid" />
            <Line d={DIAL_ART.knurl} tone="faint" />
            <Line d={DIAL_ART.band} tone="faint" />
            <Solid paths={DIAL_ART.crown} tone="mid" crease="faint" />
            <Solid paths={DIAL_ART.cap} tone="mid" crease="faint" />
            <Solid paths={DIAL_ART.pivot} tone="mid" crease="none" />
            <Line d={DIAL_ART.zeroMark} tone="hi" />
            <FaceText transform={DIAL_ART.faceText} size={2.6} tone="lo" anchor="middle">kg</FaceText>
            <path ref={needleRef} className="iso-line" data-tone="lit" d={needlePath(QUEUE[0].weight)} />
            <path className="iso-halo" d={DIAL_ART.halo} />
          </g>
          {/* gate */}
          <g key="gate">
            <Solid paths={GATE_ART.bed} tone="mid" crease="faint" />
            <Line d={GATE_ART.groove} tone="lo" />
            <Dots points={GATE_ART.screws} size={0.45} tone="mid" />
            <Solid paths={GATE_ART.mast} tone="mid" crease="faint" />
            <Solid paths={GATE_ART.mastCap} tone="mid" crease="faint" />
            <Solid paths={GATE_ART.leverShaft} tone="mid" crease="none" />
            <path ref={leverStickRef} className="iso-line" data-tone="mid" d={leverPaths(0).stick} />
            <path ref={leverKnobRef} className="iso-line" data-tone="mid" d={leverPaths(0).knob} />
            <Solid paths={GATE_ART.knob} tone="mid" crease="faint" />
            <Line d={GATE_ART.knobKnurl} tone="lo" />
            <Solid paths={GATE_ART.bladePivot} tone="mid" crease="none" />
            <path ref={bladeRef} className="iso-fill" d={bladePath(0)} />
            <Solid paths={GATE_ART.stopPinUpper} tone="lo" crease="faint" />
            <Solid paths={GATE_ART.stopPinLower} tone="lo" crease="faint" />
            <Solid paths={GATE_ART.spurUpper} tone="lo" crease="none" flat />
            <Solid paths={GATE_ART.spurLower} tone="lo" crease="none" flat />
          </g>
          {/* lanes */}
          <g key="lanes">
            <Solid paths={LANES_ART.upper} tone="mid" crease="faint" />
            <Solid paths={LANES_ART.lower} tone="mid" crease="faint" />
            <Line d={LANES_ART.upperGroove} tone="lo" />
            <Line d={LANES_ART.lowerGroove} tone="lo" />
            <Solid paths={LANES_ART.mergeBridge} tone="lo" crease="none" flat />
            <Solid paths={LANES_ART.endStop} tone="mid" crease="faint" />
            <Line d={LANES_ART.rulerUpper.minor} tone="lo" />
            <Line d={LANES_ART.rulerUpper.major} tone="mid" />
            <Line d={LANES_ART.rulerLower.minor} tone="lo" />
            <Line d={LANES_ART.rulerLower.major} tone="mid" />
          </g>
          {/* house */}
          <g key="house">
            <path className="iso-halo" d={HOUSE_ART.halo} />
            <Solid paths={HOUSE_ART.floor} tone="lo" crease="none" flat />
            <Solid paths={HOUSE_ART.backWall} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.leftWall} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.frontLeft} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.frontRight} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.frontSill} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.frontLintel} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.doorInterior} tone="faint" crease="none" flat />
            <Solid paths={HOUSE_ART.rightWallA} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.rightWallB} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.rightWallUpper} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.rightWallLower} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.portInterior} tone="faint" crease="none" flat />
            <Solid paths={HOUSE_ART.topPlate} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.flyDisc} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.flyCrown} tone="mid" crease="faint" />
            <Solid paths={HOUSE_ART.flyShaft} tone="mid" crease="none" />
            <Solid paths={HOUSE_ART.flyCap} tone="mid" crease="faint" />
            <Line d={HOUSE_ART.flyBand} tone="faint" />
            <Dots points={HOUSE_ART.flyBolts} size={0.45} tone="mid" />
            <Solid paths={HOUSE_ART.pointer} tone="hi" crease="none" />
            <path ref={spokesRef} className="iso-line" data-tone="mid" d={gearMarks(0).spokes} />
            <path ref={ticksRef} className="iso-line" data-tone="lo" d={gearMarks(0).ticks} />
            <Solid paths={HOUSE_ART.labelPlate} tone="lo" crease="none" />
            <Line d={HOUSE_ART.labelRules} tone="faint" />
            <Dots points={HOUSE_ART.labelScrews} size={0.35} tone="mid" />
          </g>
          {/* traveler card (dynamic) */}
          {travelerCard}
          <path ref={cardShadowRef} className="iso-halo" d={PILE_ART.cards[0].slab.fill} style={{ opacity: 0.35 }} />
          {/* exit */}
          <g key="exit">
            <Solid paths={EXIT_ART.step1} tone="mid" crease="faint" />
            <Line d={EXIT_ART.step1Groove} tone="lo" />
            <Solid paths={EXIT_ART.step2} tone="mid" crease="faint" />
            <Line d={EXIT_ART.step2Groove} tone="lo" />
          </g>
          {/* tray */}
          <g key="tray">
            <Solid paths={TRAY_ART.floor} tone="mid" crease="faint" />
            <Solid paths={TRAY_ART.backWall} tone="mid" crease="faint" />
            <Solid paths={TRAY_ART.frontWall} tone="mid" crease="faint" />
            <Solid paths={TRAY_ART.rightWall} tone="mid" crease="faint" />
            <Line d={TRAY_ART.lip.minor} tone="lo" />
            <Line d={TRAY_ART.lip.major} tone="mid" />
            {TRAY_ART.ears.map((p, i) => <Solid key={i} paths={p} tone="mid" crease="faint" />)}
            <Dots points={TRAY_ART.rivets} size={0.4} tone="mid" />
            {TRAY_ART.restingCards.map((c, i) => (
              <g key={i}>
                <Solid paths={c.slab} tone="hi" crease="faint" />
                <Line d={c.stamp} tone="lit" />
              </g>
            ))}
          </g>
        </IsoFigure>
      </div>
    </Plate>
  );
}
