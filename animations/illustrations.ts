import gsap from 'gsap'

export function animateCharacterEntrance(target: Element | string) { return gsap.from(target, { x: 48, y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }) }
export function animateCharacterIdle(target: Element | string) { return gsap.to(target, { y: -4, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' }) }
export function animateCharacterWalk(target: Element | string) { return gsap.to(target, { x: 18, duration: 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut' }) }
export function animateCharacterPhone(target: Element | string) { return gsap.to(target, { rotate: 3, transformOrigin: 'center', duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' }) }
export function animateHeroText(target: Element | string) { return gsap.from(target, { y: 24, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' }) }
export function animateEcoDropNetwork(target: Element | string) { return gsap.from(target, { scale: 0.96, opacity: 0, duration: 0.8, ease: 'power2.out' }) }
export function animateMessageTransfer(target: Element | string) { return gsap.to(target, { x: 24, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }) }
export function animateContextaReading(target: Element | string) { return gsap.fromTo(target, { opacity: 0.45, y: 6 }, { opacity: 1, y: 0, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' }) }
export function animateHabitualzProgress(target: Element | string) { return gsap.fromTo(target, { scale: 0.9, transformOrigin: 'center' }, { scale: 1, duration: 0.8, repeat: -1, yoyo: true, ease: 'power2.inOut' }) }
export function animateMinimizUrlTransform(target: Element | string) { return gsap.fromTo(target, { scaleX: 1, transformOrigin: 'center' }, { scaleX: 0.72, duration: 1, repeat: -1, yoyo: true, ease: 'power2.inOut' }) }
export function animateExperienceScene(target: Element | string) { return gsap.from(target, { y: 18, opacity: 0, duration: 0.8, ease: 'power3.out' }) }
