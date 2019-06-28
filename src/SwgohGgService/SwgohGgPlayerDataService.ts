import Axios from 'axios';

export default class SwgohGgPlayerDataService {

    public getCharacterData(allyCode: string): Promise<ISwgohPlayerDataPayload> {
        return new Promise<ISwgohPlayerDataPayload>((accept, reject) => {
            const axiosConfig = {
                headers: {
                    'x-requested-with': window.location.origin,
                },
            };
            Axios.get('https://cors-anywhere.herokuapp.com/https://swgoh.gg/api/player/' + allyCode, axiosConfig)
                .then((response) => {
                if (response.status < 200 || response.status > 299) {
                    reject(JSON.stringify(response.data));
                    return;
                }
                accept(response.data as unknown as ISwgohPlayerDataPayload);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}

interface ISwgohPlayerDataPayload {
    units: ISwgohPlayerUnit[];
}

interface ISwgohPlayerUnit {
    data: ISwgohPlayerUnitData;
}
interface ISwgohPlayerUnitData {
    name: string;
    gear_level: number;
    gear: ISwgohGearEntry[];
}

interface ISwgohGearEntry {
    slot: number;
    is_obtained: boolean;
}
