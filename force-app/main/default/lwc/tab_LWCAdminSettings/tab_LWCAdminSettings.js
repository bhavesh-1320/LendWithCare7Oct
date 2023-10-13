import { LightningElement,wire } from 'lwc';
import Id from '@salesforce/user/Id';
import executeOffsetCalculationManually from '@salesforce/apex/LWCAdminSettingsCtrl.executeOffsetCalculationManually';
import updateFXRatesManually from '@salesforce/apex/LWCAdminSettingsCtrl.updateFXRatesManually';
import getVisibilityDetails from '@salesforce/apex/ApprovalComponentController.getPermissionSetDetails';

export default class Tab_LWCAdminSettings extends LightningElement {

    userId = Id;
    isVisible=false;
    handleOffsetCalculation() {
        executeOffsetCalculationManually({}).then(result => {
            console.log('result--> ' + result);
        }).catch(error => {
            console.log('Erroccured:- ' + error.message);
        })
    }

    @wire(getVisibilityDetails, {userId: '$userId'})
    wiredVisibility({ error, data }) {
        console.log(data);
        if (data) {
            for (let i = 0; i < data.length; i++) 
            {
                
                if(data[i]==='LWC_Admin')
                {
                    
                    this.isVisible=true;

                }
            }
        }
        else if(error)
        {
            console.log('error',JSON.stringify(error));
        }
    }


    handleUpdateFXRates() {
        updateFXRatesManually({}).then(result => {
            console.log('result--> ' + result);
        }).catch(error => {
            console.log('Erroccured:- ' + error.message);
        })
    }


}