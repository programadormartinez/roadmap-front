
import { Component, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

declare var VANTA: any;

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [],
    templateUrl: './landing.html',
    styleUrls: ['./landing.css']
})
export class Landing implements OnInit, OnDestroy, AfterViewInit {
    private vantaEffect: any;

    constructor(
        private router: Router,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/roadmap']);
        }
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.loadVantaScripts();
        }
    }

    private loadVantaScripts() {
        // Dynamically load Three.js and Vanta for better compatibility in Angular
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        threeScript.onload = () => {
            const vantaScript = document.createElement('script');
            vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
            vantaScript.onload = () => {
                this.initVanta();
            };
            document.head.appendChild(vantaScript);
        };
        document.head.appendChild(threeScript);
    }

    private initVanta() {
        if (typeof VANTA !== 'undefined') {
            this.vantaEffect = VANTA.NET({
                el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x00f2ff,
                backgroundColor: 0x0a0b10,
                points: 15.00,
                maxDistance: 20.00,
                spacing: 16.00
            });
        }
    }

    navigateToRegister() {
        this.router.navigate(['/register']);
    }

    navigateToLogin() {
        this.router.navigate(['/login']);
    }

    scrollToFeatures() {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }

    ngOnDestroy() {
        if (this.vantaEffect) {
            this.vantaEffect.destroy();
        }
    }
}
