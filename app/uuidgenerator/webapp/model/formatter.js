sap.ui.define([], function () {
    "use strict";
    return {
        // Change name to match XML call: .formatter.formatSrNo
        formatSrNo: function (sValue) {
            // 'this' refers to the Controller because of the '.' in XML
            const oTable = this.byId("uuidTable");
            if (!oTable) return "";
            
            const aItems = oTable.getItems();
            for (let i = 0; i < aItems.length; i++) {
                // Corrected sID to sValue to match function parameter
                if (aItems[i].getBindingContext()?.getProperty("ID") === sValue) {
                    return i + 1;
                }
            }
            return "";
        }
    };
});
