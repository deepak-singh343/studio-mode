import { Mesh, ShaderMaterial, Texture, Color, WebGLRenderer } from "three";
export declare class DiamondMaterial extends ShaderMaterial {
    private normalBakeHelperMesh_;
    private cubeCamera_;
    private localScene_;
    private needsNormalsUpdate_;
    private offset_;
    private sparkles_;
    private envMap_;
    constructor(mesh?: Mesh, envMap_?: Texture, renderer?: WebGLRenderer, size?: number);
    clone(): DiamondMaterial;
    prepareNormalsCubeMap(renderer: any): void;
    dispose(disposeResources: any): void;
    set lut(v: any);
    get lut(): any;
    get isDiamondMaterial(): boolean;
    set envMap(envMap: any);
    set envMapRotation(envMapRotation: any);
    set envMapIntensity(envMapIntensity: any);
    set dispersion(dispersion: any);
    set squashFactor(squashFactor: any);
    set geometryFactor(geometryFactor: any);
    set gammaFactor(gammaFactor: any);
    set absorbptionFactor(absorbptionFactor: any);
    set refractiveIndex(refractiveIndex: any);
    set color(color: Color);
    set boostFactors(boostFactors: any);
    get envMap(): any;
    get envMapRotation(): any;
    get envMapIntensity(): any;
    get dispersion(): any;
    get squashFactor(): any;
    get geometryFactor(): any;
    get refractiveIndex(): any;
    get color(): Color;
    get boostFactors(): any;
    get gammaFactor(): any;
    get absorbptionFactor(): any;
}