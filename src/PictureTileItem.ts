import { FlowObjectData } from "flow-component-model";
import { faBalanceScale, faCarCrash, faChargingStation, faCommentDollar, faCube, faFighterJet, faFilm, faGavel, faGraduationCap, faHardHat, faHeartbeat, faHospitalUser, faIndustry, faLandmark, faMicrochip, faMicrophone, faOilCan, faPalette, faPhoneVolume, faPiggyBank, faShoppingCart, faSnowplow, faStore, faStoreAlt, faTruckMonster, faTruckMoving, faTshirt, faUniversity, faUserTie, faUtensils, IconDefinition } from '@fortawesome/free-solid-svg-icons';

export default class PictureTileItem {
    id: string ;
    title: string ;
    text: string;
    logoUri: string;
    link: string;
    objectData: FlowObjectData;
}