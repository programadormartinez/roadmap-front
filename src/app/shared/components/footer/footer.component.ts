
import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <footer class="w-full mt-auto pb-8 flex flex-col items-center gap-10 border-t border-white/5 pt-12 bg-bg-dark/50 backdrop-blur-sm">
        <!-- Motivational Quote -->
        <div class="text-center max-w-2xl px-4">
            <p class="text-accent-primary font-medium italic text-lg mb-3 h-14 flex items-center justify-center">
                "{{ currentQuote() }}"
            </p>
            <div class="h-1 w-12 bg-accent-secondary mx-auto rounded-full blur-[1px]"></div>
        </div>

        <!-- Personal Info Footer -->
        <div class="flex flex-col items-center gap-4">
            <div class="flex gap-8 text-text-dim">
                <a href="https://www.linkedin.com/in/martinezaldodev/" target="_blank" class="hover:text-accent-primary transition-all hover:scale-110 text-xs flex items-center gap-2">
                    LinkedIn
                </a>
                <a href="https://github.com/programadormartinez" target="_blank" class="hover:text-accent-primary transition-all hover:scale-110 text-xs flex items-center gap-2">
                    GitHub
                </a>
            </div>
            <div class="text-center">
                <p class="text-[10px] text-text-dim uppercase tracking-[0.2em]">
                    Desarrollado por <span class="text-accent-secondary font-bold">Aldo Martinez</span>
                </p>
                <p class="text-[12px] text-accent-primary mt-1 font-medium">Con Cariño Aldo © 2026</p>
            </div>
        </div>
    </footer>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-quote {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `]
})
export class FooterComponent implements OnInit, OnDestroy {
    quotes = [
        "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
        "El futuro pertenece a quienes creen en la belleza de sus sueños.",
        "La mejor forma de predecir el futuro es creándolo.",
        "Tu código es el pincel con el que pintas el mañana.",
        "No te detengas hasta que estés orgulloso.",
        "Dominar una tecnología es el primer paso para cambiar el mundo.",
        "2026 es el año de tu evolución definitiva."
    ];

    currentQuote = signal(this.quotes[0]);
    private intervalId: any;

    ngOnInit() {
        this.intervalId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * this.quotes.length);
            this.currentQuote.set(this.quotes[randomIndex]);
        }, 10000);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
