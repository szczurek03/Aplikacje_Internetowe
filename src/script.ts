const STYLES: Record<string, string> = {
    "Autumn": "/style-1.css",
    "Pixel": "/style-2.css",
    "Winter": "/style-3.css"
};

class Toggler {

    styles: Record<string, string>;
    currentStyle: string;
    styleLink: HTMLLinkElement | null = null;

    constructor(styles: Record<string, string>) {
        this.styles = styles;
        this.currentStyle = Object.keys(styles)[0];
        this.init();
    }

    init() {
        this.styleLink = document.createElement("link");
        this.styleLink.rel = "stylesheet";
        this.styleLink.href = this.styles[this.currentStyle];
        document.head.appendChild(this.styleLink);
        this.drawLink();
    }

    toggleStyle(name: string, href: string) {
        if (!this.styleLink) return;
    
        document.head.removeChild(this.styleLink);
        this.styleLink = document.createElement("link");
        this.styleLink.rel = "stylesheet";
        this.styleLink.href = href; 
        document.head.appendChild(this.styleLink);
    
        this.currentStyle = name;
        console.log("Toggled to style:",name);
    }

    drawLink() {
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.bottom = "10px";
        container.style.right = "10px";
        container.style.backgroundColor = "#F6E6FA";
        container.style.padding = "5px";
        container.style.opacity = "0.5";
        container.style.zIndex = "1000";

        Object.entries(this.styles).forEach(([name, href]) => {
            const link = Object.assign(document.createElement("a"), {
                href: "#",
                textContent: name,
                style: "display:block; margin-bottom:2px;"
            });
    
            link.addEventListener("click", e => {
                e.preventDefault();
                this.toggleStyle(name, href);
            });
    
            container.appendChild(link);
        });
    
        document.body.appendChild(container);
    }
}

const toggler = new Toggler(STYLES);

