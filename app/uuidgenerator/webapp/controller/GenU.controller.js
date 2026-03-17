sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "uuidgenerator/model/formatter",
    "sap/ui/core/BusyIndicator",
    "sap/ui/export/Spreadsheet",
], (Controller, MessageToast, formatter, BusyIndicator, Spreadsheet) => {
    "use strict";

    return Controller.extend("uuidgenerator.controller.GenU", {
        formatter: formatter,
        onInit() {
            const oModel = this.getView().getModel();
            console.log("ODataModel", oModel);
        },

        //You are executing the action, grabbing the result context, and then telling the table to re-render itself using the value array from that result.
        onGeneratePress: async function () {
            const oView = this.getView();
            const oTable = oView.byId("uuidTable");
            const oModel = this.getView().getModel(); // Standard OData V4 Model
            const iNum = oView.byId("numInput").getValue();

            // 1. Create the OData V4 Operation Binding for the Action
            // The (...) syntax is required for OData V4 actions
            const oAction = oModel.bindContext("/generateRecords(...)");

            // 2. Set the input parameter "num"
            oAction.setParameter("num", iNum);

            try {
                //oView.setBusy(true);
                BusyIndicator.show();

                //Sends a POST request to your CAP service. Because it uses await, the code "pauses" here until the backend responds with the array of UUIDs.
                await oAction.execute();

                // In OData V4, an action result is stored in its own "context." 
                // You are telling the table: "Hey, your data is now living inside this specific action result."
                const oActionContext = oAction.getBoundContext();
                oTable.setBindingContext(oActionContext);

                // Get the existing binding info
                const oBindingInfo = oTable.getBindingInfo("items");

                // oBindingInfo.template: This grabs the "blueprint" of a row (the columns and texts) you defined in your XML.
                // path: "value": In OData V4, when an action returns a list, it is always wrapped in a property called value.
                // oTable.bindItems: This forces the table to redraw itself using that "value" array as the source.
                if (oBindingInfo && oBindingInfo.template) {
                    oTable.bindItems({
                        path: "value",
                        template: oBindingInfo.template
                    });
                }

                MessageToast.show("UUIDs generated successfully!");
                BusyIndicator.hide();

            } catch (oError) {
                console.error(oError);
                MessageToast.show("Error: " + oError.message);
            }
        },

        //Export Functionlaity
        onExport: function () {
            const oTable = this.byId("uuidTable");
            const oRowBinding = oTable.getBinding("items");
            const iLength = oRowBinding.getLength();

            // 1. Get the data currently in the table as a JSON array
            // requestContexts(0, iLength) is the OData V4 way to get the data
            oRowBinding.requestContexts(0, iLength).then((aContexts) => {
                const aData = aContexts.map((oContext, index) => {
                    const oRow = oContext.getObject();
                    return {
                        ...oRow,
                        SrNo: index + 1
                    }
                });

                // 2. Define the columns for the Excel file
                const aCols = [
                    {
                        label: 'Sr. No.', property: 'SrNo', type: 'number',
                        textAlign: 'center'
                    },
                    { label: 'UUID', property: 'ID', type: 'string' }
                ];

                // 3. Configure export settings
                const oSettings = {
                    workbook: { columns: aCols },
                    dataSource: aData,
                    fileName: "Generated_UUIDs.xlsx",
                    worker: false
                };

                // 4. Trigger the export
                const oSheet = new Spreadsheet(oSettings);
                oSheet.build()
                    .then(() => MessageToast.show("Export finished!"))
                    .finally(() => oSheet.destroy());
            });
        }

    });
});