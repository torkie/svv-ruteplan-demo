export interface IFeature {
    geometry: IGeometry,
    properties: IProperty
}

export interface IGeometry {
    coordinates: ICoordinate[]
}
export interface ICoordinate {

}

export interface IProperty {
    CAMERA_ID: number,
    STILL_IMAGE_URL: string,
    ROAD_NUMBER: string,
    DESCRIPTION: string,
    ORIENTATION_DESCRIPTION: string,
    STILL_IMAGE_URL_DESCRIPTION: string,
    VIDEO_URL: string

}