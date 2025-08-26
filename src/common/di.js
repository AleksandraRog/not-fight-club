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
import { StartRepository } from "../enter/StartRepository.js";
import { StartRepositoryImpl } from "../enter/StartRepsitoryImpl.js";
import { StartModel } from "../enter/StartModel.js";
import { CharacterModel } from "../character/CharacterModel.js";
import { CharacterRepository } from "../character/CharacterReposirory.js";
import { CharacterRepositoryImpl } from "../character/CharacterRepositoryImpl.js";
import { RootModel } from "../root/RootModel.js";
import { StorageRepository } from "./StorageRepository.js";
import { StorageRepositoryImpl } from "./StorageRepsitoryImpl.js";
import { BattleModel } from "../battle/BattleModel.js";
import { BattleRepository } from "../battle/BattleRepository.js";
import { BattleInteractor } from "../battle/BattleInteractor.js";
import { BattleRepositoryImpl } from "../battle/BattleRepositoryImpl.js";
import { RootRepository } from "../root/RootRepository.js";
import { RootRepositoryImpl } from "../root/RootRepositoryImpl.js";


const di = new DIModule();

di.register(LocalStorageClient, new LocalStorageClient());
di.register(BattleInteractor, new BattleInteractor())

di.register(StorageRepository, new StorageRepositoryImpl(di.resolve(LocalStorageClient)));
di.register(SettingRepository, new SettingRepositoryImpl(di.resolve(LocalStorageClient), di.resolve(LocalStorageClient)));
di.register(StartRepository, new StartRepositoryImpl(di.resolve(LocalStorageClient)));
di.register(CharacterRepository, new CharacterRepositoryImpl(di.resolve(LocalStorageClient)));
di.register(BattleRepository, new BattleRepositoryImpl(di.resolve(LocalStorageClient)));
di.register(RootRepository, new RootRepositoryImpl(di.resolve(LocalStorageClient)));

di.register(SettingModel, new SettingModel(di.resolve(SettingRepository), di.resolve(StorageRepository)));
di.register(StartModel, new StartModel(di.resolve(StartRepository)));
di.register(CharacterModel, new CharacterModel(di.resolve(CharacterRepository), di.resolve(StorageRepository)));
di.register('RootModel', new RootModel(di.resolve(RootRepository), di.resolve(StorageRepository)));
di.register(BattleModel, new BattleModel(di.resolve(BattleRepository), di.resolve(StorageRepository), di.resolve(BattleInteractor)))

di.register('/setting', new SettingFragment(null, di.resolve(SettingModel)));
di.register('/main', new MainFragment());
di.register('/character', new CharacterFragment(null, di.resolve(CharacterModel)));
di.register('/battle', new BattleFragment(null, di.resolve(BattleModel)));
di.register('/', new StartFragment(null, di.resolve(StartModel)));

export { di };
