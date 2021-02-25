<p align="center">
  <a href="https://technology.atnicecactus.gg//">
    <img src="https://app.nicecactus.gg/assets/img/logo/nicecactus-logo.svg" alt="Nicecactus logo" width="1000" height="180">
  </a>
</p>

<h3 align="center">NG React Module Wrapper</h3>

<p align="center">
  Easily integrate standalone react modules into your Angular application
</p>

<p align="center">
  <a href="https://badge.fury.io/js/%40nicecactus%2Fng-react-module-wrapper"><img src="https://badge.fury.io/js/%40nicecactus%2Fng-react-module-wrapper.svg" alt="npm version" ></a>
</p>

## Table of contents

- [Quick start](#quick-start)
- [API Reference](#api-reference)

## Quick start

Install `@nicecactus/ng-react-module-wrapper`:

- with [npm](https://www.npmjs.com/): `npm install -S @nicecactus/ng-react-module-wrapper`
- with [yarn](https://yarnpkg.com/): `yarn add @nicecactus/ng-react-module-wrapper`

Add the module to NgModule imports

#### **`AppModule`**
```ts
import { NgReactModuleWrapperModule } from '@nicecactus/ng-react-module-wrapper';

@NgModule({
  ...
  modules: [ NgReactModuleWrapperModule, ... ],
  ...
})
```

Create a loader component for your react module.  
We will assume that:
* the asset-manifest.json file url is stored in `environment.assetManifestUrl`  
* once loaded, the react module `render()` function is exposed in `window.myOrg.myModule`
* the module will be served with the relative path `/my-module`


#### **`my-module-loader.component.ts`**
```ts
import { Component } from '@angular/core';

import { environment } from 'projects/my-project/src/environments/environment';

@Component({
  selector: 'app-my-modue-loader',
  templateUrl: './my-modue-loader.component.html',
})
export class MyModuleLoaderComponent {
  const assetManifestUrl = environment.assetManifestUrl;
}
```

#### **`my-module-loader.component.html`**
```ts
<ng-react-module-wrapper assetManifestUrl="{{assetManifestUrl}}" exportPath="myOrg.myModule" basename="/my-module"></ng-react-module-wrapper>
```

Expose the loader in the app router

#### **`AppRoutingModule`**
```ts
const routes: Routes = [
  {
    path: 'my-module',
    children: [
        {
            path: '**',
            component: MyModuleLoaderComponent,
        },
    ],
  }
];
```

## API Reference

### [NgReactModuleWrapper](https://github.com/Nicecactus/ng-react-module-wrapper/blob/master/src/lib/ng-react-module-wrapper.component.ts)

|||
|-|-|
| Selector | `ng-react-module-wrapper` |

### Inputs
|||
|-|-|
| `assetManifestUrl` | Type: `string` <br /> URL to the `asset-manifest.json`. |
| `exportPath` | Type: `string` <br /> Path to the exported `render()` function once the module has been loaded. |
| `basename` | Type: `string` <br /> Default value: `/` <br /> Relative path the module is being served from. |
| `arguments` | Type: `object` <br /> Default value: `{}` <br /> Extra arguments to pass to the `render()` function. |

### Outputs
|||
|-|-|
| `loaded` | Type: `EventEmitter<HTMLElement>` <br /> Emits an event when the module has been loaded. |
| `rendered` | Type: `EventEmitter<any>` <br /> Emits an event when the module has been rendered. |
