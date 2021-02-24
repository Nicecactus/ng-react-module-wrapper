import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { getObjectFromPath } from '../utils/getObjectFromPath';

export interface AssetManifest {
  entrypoints: Array<string>;
}

interface ResourceCache {
  assetManifests: Cache<Promise<any>>;
  scripts: Cache<Promise<void>>;
  styles: Cache<Promise<void>>;
}

interface Cache<T> {
  [key: string]: T;
}

@Component({
  selector: 'ng-react-module-wrapper',
  templateUrl: './ng-react-module-wrapper.component.html',
})
export class NgReactModuleWrapperComponent implements OnInit, AfterViewInit {
  private static resourceCache: ResourceCache = {
    assetManifests: {},
    scripts: {},
    styles: {},
  };

  @ViewChild('anchor') anchorEl?: ElementRef;

  @Input() assetManifestUrl!: string;

  @Input() exportPath!: string;

  @Input() basename?: string;

  @Input() arguments?: any = {};

  @Output() loaded = new EventEmitter<HTMLElement>();

  private initialized = false;
  private executed = false;

  constructor(
    private readonly renderer: Renderer2,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    const assetManifest = await this.loadManifest(this.assetManifestUrl);
    if (!assetManifest) {
      return;
    }

    const origin = new URL(this.assetManifestUrl).origin;
    const scripts = assetManifest.entrypoints.filter(f => f.endsWith('.js'));
    const styles = assetManifest.entrypoints.filter(f => f.endsWith('.css'));
    await Promise.all([
      ...scripts.map(s => this.loadScript(`${origin}/${s}`)),
      ...styles.map(s => this.loadStyle(`${origin}/${s}`)),
    ]);
    this.initialized = true;

    this.execute();
  }

  ngAfterViewInit(): void {
    this.execute();
  }

  private execute(): void {
    if (this.executed || !this.anchorEl || !this.initialized) {
      return;
    }

    this.executed = true;
    const obj = getObjectFromPath(this.exportPath);
    if (!obj) {
      return;
    }

    obj.render({
      element: this.anchorEl.nativeElement,
      basename: this.basename || '/',
      navigate: (commands: any[], options: NavigationExtras) => this.router.navigate(commands, { relativeTo: this.route, ...options }),
      ...this.arguments,
    });
    this.loaded.emit(this.anchorEl.nativeElement);
  }

  private async loadManifest(src: string): Promise<AssetManifest> {
    if (!NgReactModuleWrapperComponent.resourceCache.assetManifests[src]) {
      NgReactModuleWrapperComponent.resourceCache.assetManifests[src] = fetch(this.assetManifestUrl).then(r => r.json());
    }

    return NgReactModuleWrapperComponent.resourceCache.assetManifests[src];
  }

  private async loadScript(src: string): Promise<void> {
    if (!NgReactModuleWrapperComponent.resourceCache.scripts[src]) {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      script.async = true;
      script.src = src;
      const promise = new Promise<void>(res => script.onload = () => res());
      document.head.appendChild(script);

      NgReactModuleWrapperComponent.resourceCache.scripts[src] = promise;
    }

    return NgReactModuleWrapperComponent.resourceCache.scripts[src];
  }

  private async loadStyle(src: string): Promise<void> {
    if (!NgReactModuleWrapperComponent.resourceCache.styles[src]) {
      const link = this.renderer.createElement('link') as HTMLLinkElement;
      link.rel = 'stylesheet';
      link.href = src;
      const promise = new Promise<void>(res => link.onload = () => res());
      document.head.appendChild(link);

      NgReactModuleWrapperComponent.resourceCache.styles[src] = promise;
    }

    return NgReactModuleWrapperComponent.resourceCache.styles[src];
  }
}
