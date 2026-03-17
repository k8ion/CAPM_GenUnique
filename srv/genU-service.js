const cds = require('@sap/cds')

module.exports = class UniqueRecordsService extends cds.ApplicationService {
    // 1. Corrected 'int' to 'init'
    init() {
        // 2. Corrected 'entites' to 'entities'
        const { UUIDs } = this.entities

        this.on('generateRecords', async (req) => {
            const { num } = req.data
            
            // 3. Corrected error handling
            if (num < 1) return req.error(400, 'Please enter valid number of records');

            const entries = []
            for (let i = 0; i < num; i++) {
                // 4. Corrected 'Push' to 'push'
                entries.push({ ID: cds.utils.uuid() })
            }
            
            return entries
        })

        return super.init()
    }
}