using {genUnique.model.db as genU} from '../db/model';

service UniqueRecordsService {
    entity UUIDs as projection on genU.GenerateId;

    //Action to take number as input and return uinque UUIDs.
    action generateRecords (num: Integer) returns array of UUIDs;
}
