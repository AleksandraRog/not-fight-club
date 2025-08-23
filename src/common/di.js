import SettingRepository from "../setting/SettingRepsitory.js";
import { SettingRepositoryImpl} from "../setting/SettingRepsitoryImpl.js";
import { SettingModel } from "../setting/SettingModel";
import { SettingFragment } from "../setting/SettingFragment";
import { DIModule } from "./DIModul";
import { LocalStorageClient } from "./LocalStorageClient";
import { CharacterFragment } from "../character/CharacterFragment";
import { MainFragment } from "../main/MainFragment";
import { BattleFragment } from "../battle/BattleFragment.js";
import { StartFragment } from "../enter/StartFragment.js";





const di = new DIModule();

di.register('localStorageClient', new LocalStorageClient());

di.register(SettingRepository, new SettingRepositoryImpl(di.resolve('localStorageClient')));

di.register('settingModel', new SettingModel(di.resolve(SettingRepository)));

di.register('/setting', new SettingFragment());
di.register('/main', new MainFragment());
di.register('/character', new CharacterFragment());
di.register('/battle', new BattleFragment());
di.register('/', new StartFragment());

export { di };
