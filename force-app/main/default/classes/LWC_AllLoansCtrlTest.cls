@isTest
public class LWC_AllLoansCtrlTest {
	@TestSetup
    private static void testData(){
        list<CollaborationGroup> cgList = LWCTestUtility.createCollaborationGroups(true);
        list<User> fspStaffUsers = LWCTestUtility.getFSPStaffUsers();
        list<Contact> borrowers = LWCTestUtility.getBorrowerRecords(fspStaffUsers);        
        list<Loan__c> loanList = LWCTestUtility.getBorrowerLoans(borrowers);
        list<Account> fspAccounts = LWCTestUtility.getFSPAccounts();
        list<Repayment_Schedule__c> rsList = new list<Repayment_Schedule__c>();
        
        ContentVersion cv = new ContentVersion();
        cv.Title = 'Test Document_cover';
        cv.PathOnClient = 'TestDocument_cover.pdf';
        cv.VersionData = Blob.valueOf('Test Content');
        cv.IsMajorVersion = true;
        Insert cv;
        
        //Get Content Documents
        Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;
        List<ContentDocumentLink> cdls = new List<ContentDocumentLink>();
        //Create ContentDocumentLink 
        
        for(Loan__c l: loanList){
            ContentDocumentLink cdl = New ContentDocumentLink();
            cdl.LinkedEntityId = l.Id;
            cdl.ContentDocumentId = conDocId;
            cdl.shareType = 'V';
            cdls.add(cdl);
            Decimal amount = l.Loan_Principal_Disbursed__c/l.Loan_Term_Months__c;
            for(Integer j=1; j<=l.Loan_Term_Months__c; j++){
                Date dt = System.Today();
                if(j==1){
                    dt=dt.addDays(-20);
                }else if(j==2){
                    
                }else{
                    dt=dt.addDays(30);
                }
                Repayment_Schedule__c rs = LWCTestUtility.getRepaymentRecord(l.Id, amount, dt);
                rs.Loan_Repayment_Number__c=j;
                rsList.add(rs);
            }
            
        }
        insert rsList;
        insert cdls;
		loanList = LWCTestUtility.submitLoanforReview(loanList);
        loanList = LWCTestUtility.getLoansSystemRejected(loanList);
        loanList = LWCTestUtility.submitLoanforReview(loanList);
        loanList = LWCTestUtility.getLoansContentApproved(loanList);
        loanList = LWCTestUtility.getLoansReadyToPublish(loanList);
        loanList = LWCTestUtility.updateLoansToPublish(loanList);
        list<Contact> lenderContacts = LWCTestUtility.getLenderContacts();
        system.debug('lenderContacts '+lenderContacts.size());
        map<String, Lender_Balance__c> lenderBalanceMap = LWCTestUtility.getLenderBalances(lenderContacts);
        system.debug('lenderBalanceMap--> '+lenderBalanceMap);
        loanList=LWCTestUtility.updateLoansToActive(loanList);
        LWCTestUtility.getLenderUsers();
        list<String> lenderIds = LWCTestUtility.getLenderUsersIds();
        //LWCTestUtility.getLoanTransactionList(loanList, lenderIds);
        LWCTestUtility.getLastMonthsRepayments();
        ContentVersion cv2 = LWCTestUtility.getContentVersion();
        LWCTestUtility.getContentDocumentLink(fspAccounts[0], cv2.Id);
        
    }
    
    @isTest
    public static void testLWCConfigSettingMetadata(){
        Test.startTest();
        LWC_AllLoansCtrl.LWCConfigSettingMetadata();
        Test.stopTest();
    }
    @isTest
    public static void testgetLeastToCompleteLoanRecord(){
        Test.startTest();
        LWC_AllLoansCtrl.getLeastToCompleteLoanRecord();
        Test.stopTest();
    }
    @isTest
    public static void testgetCurrentUser(){
        Test.startTest();
        LWC_AllLoansCtrl.getCurrentUser();
        Test.stopTest();
    }
    @isTest
    public static void testgetRDCurrentUser(){
        
        Contact conRec = new Contact();
        conRec.LastName = 'test1';
        conRec.KYC_Required__c = false;
        conRec.KYC_failed__c = false;
        conRec.KYC_Completed__c = true;
        
        insert conRec;
        
        Cart__c cart = new Cart__c();
        cart.Last_Transaction_DateTime__c = system.now();
        cart.Contact__c = conRec.Id;
        cart.Is_Having_RD__c = true;
        insert cart;
        
        Test.startTest();
        LWC_AllLoansCtrl.getRDCurrentUser(conRec.Id);
        Test.stopTest();
    }
    @isTest
    public static void testcreateTransactionRecord(){
        List<Contact> conList = new List<Contact>();
        Contact conRec = new Contact();
        conRec.LastName = 'test1';
        conRec.KYC_Required__c = false;
        conRec.KYC_failed__c = false;
        conRec.KYC_Completed__c = true;
        conList.add(conRec);
        if(conList.size()>0){
            insert conList;
        }
        
        Lender_Balance__c LB = new Lender_Balance__c();
          LB.Balance__c = 1000;
        LB.Lender__c = conList[0].Id;
        insert LB;
        
        List<Transaction__c> tranList = new List<Transaction__c>();
        List<Loan__c> loanList = [select id from Loan__c limit 10];
        //system.debug('conList[0].Id '+conList[0].Id);
        for(integer i=0; i<loanList.size(); i++){
            Transaction__c tran = new Transaction__c();
            tran.Amount__c = 25;
            tran.Type__c = 'Loan';
            tran.Loan__c = loanList[i].id;
            tran.status__c = 'Held';
            //tran.Lender__c = conList[0].Id;
            tranList.add(tran);
        }
        
        Cart__c cart = new Cart__c();
        cart.Last_Transaction_DateTime__c = system.now();
        cart.Contact__c = conList[0].Id;
        insert cart;
        
        system.debug('loanList size ' + loanList.size());
        
        Test.startTest();
        //LWC_AllLoansCtrl.createTransactionRecord(tranList);
        Test.stopTest();
    }
    @isTest
    public static void testupdateTransactionRecord(){
        List<Loan__c> loanList = [select id from Loan__c limit 10];
        
            Transaction__c tran = new Transaction__c();
            tran.Amount__c = 25;
            tran.Type__c = 'Loan';
            tran.Loan__c = loanList[0].id;
        	tran.status__c = 'Held';
            insert tran;
        	
        	Transaction__c trans = [select id,Amount__c from Transaction__c where Id=:tran.Id limit 1];
        	trans.Amount__c = 35;
        
        Test.startTest();
        LWC_AllLoansCtrl.updateTransactionRecord(trans);
        Test.stopTest();
    }
    @isTest
    public static void testremoveTransactionRecord(){
        
            Transaction__c tran = new Transaction__c();
            tran.Amount__c = 25;
            tran.Type__c = 'Topup';
        	tran.status__c = 'Held';
        	tran.Added_To_Cart__c = true;
            insert tran;
        	
        	
        Test.startTest();
        LWC_AllLoansCtrl.removeTransactionRecord(tran.Id);
        Test.stopTest();
    }
    @isTest
    public static void testremoveTransactionRecords(){
        
        
        Cart__c cart = new Cart__c();
        cart.Last_Transaction_DateTime__c = system.now();
        insert cart;
        
        List<Transaction__c> tranList = new List<Transaction__c>();
        List<Loan__c> loanList = [select id from Loan__c limit 10];
        system.debug('loanList 124'+loanList);
        for(integer i=0; i>=loanList.size(); i++){
            Transaction__c tran = new Transaction__c();
            tran.Amount__c = 25;
            tran.Type__c = 'Loan';
            tran.Loan__c = loanList[i].id;
            tran.status__c = 'Held';
            tranList.add(tran);
        }
        insert tranList;
        List<Id> idToremove = new List<Id>();
        for(Transaction__c tran: tranList){
            idToremove.add(tran.Id);
        }
        Test.startTest();
        LWC_AllLoansCtrl.removeTransactionRecords(idToremove);
        Test.stopTest();
    }
    @isTest
    public static void testTopupTransactionRecords(){
        List<Contact> conList = new List<Contact>();
        Contact conRec = new Contact();
        conRec.LastName = 'test1';
        conRec.KYC_Required__c = false;
        conRec.KYC_failed__c = false;
        conRec.KYC_Completed__c = true;
        conList.add(conRec);
        if(conList.size()>0){
            insert conList;
        }
        
        Lender_Balance__c LB = new Lender_Balance__c();
          LB.Balance__c = 1000;
        LB.Lender__c = conList[0].Id;
        insert LB;
        
        Cart__c cart = new Cart__c();
        cart.Last_Transaction_DateTime__c = system.now();
        cart.Contact__c = conList[0].Id;
        insert cart;
        
        Transaction__c tran = new Transaction__c();
            tran.Amount__c = 25;
            tran.Type__c = 'Topup';
        	tran.status__c = 'Held';
        tran.Lender__c = conList[0].Id;
        	tran.Added_To_Cart__c = true;
        
        Test.startTest();
        LWC_AllLoansCtrl.TopupTransactionRecords(tran);
        Test.stopTest();
        
    }
     @isTest
    public static void testrecurringRecordCreation(){
        Campaign parentCampaign = new Campaign();
        parentCampaign.Name = 'Parent Campaign';
        parentCampaign.IsActive = true; 
        // Set other fields as needed
        insert parentCampaign;
        
        // Create the child Campaign record
        Campaign childCampaign = new Campaign();
        childCampaign.Name = 'Child Campaign';
        childCampaign.IsActive = true;
        childCampaign.ParentId = parentCampaign.Id; 
        // Set other fields as needed
        insert childCampaign;
        
        
        Stripe_Setting__c stripe = new Stripe_Setting__c();
        stripe.Name='default';
        stripe.Default_Campaign__c = childCampaign.Id;
        stripe.Activation__c = true;
        insert stripe;
        
        List<Contact> conList = new List<Contact>();
        Contact conRec = new Contact();
        conRec.LastName = 'test1';
        conRec.KYC_Required__c = false;
        conRec.KYC_failed__c = false;
        conRec.KYC_Completed__c = true;
        conList.add(conRec);
        if(conList.size()>0){
            insert conList;
        }
        
        Cart__c cart = new Cart__c();
        cart.Last_Transaction_DateTime__c = system.now();
        cart.Contact__c = conList[0].Id;
        insert cart;
        
        npe03__Recurring_Donation__c rd = new npe03__Recurring_Donation__c();
        rd.npe03__Amount__c = 10;
        rd.npe03__Contact__c = conList[0].Id;
        rd.npsp__RecurringType__c = 'Fixed';
        rd.Payment_Gateway__c = 'Stripe';
        rd.CurrencyIsoCode = 'AUD';
        
        Test.startTest();
        LWC_AllLoansCtrl.recurringRecordCreation(rd);
        Test.stopTest();
        
    }
    @isTest
    public static void testgetLenderBalance(){
        List<Contact> conList = new List<Contact>();
        Contact conRec = new Contact();
        conRec.LastName = 'test1';
        conRec.KYC_Required__c = false;
        conRec.KYC_failed__c = false;
        conRec.KYC_Completed__c = true;
        conList.add(conRec);
        if(conList.size()>0){
            insert conList;
        }
        
        Lender_Balance__c LB = new Lender_Balance__c();
        LB.Balance__c = 1000;
        LB.Lender__c = conList[0].Id;
        insert LB;
        Test.startTest();
        LWC_AllLoansCtrl.getLenderBalance(conList[0].Id);
        Test.stopTest();
    }
    @isTest
    public static void testdonateFromDashboard(){
        List<Contact> conList = new List<Contact>();
        Contact conRec = new Contact();
        conRec.LastName = 'test1';
        conRec.KYC_Required__c = false;
        conRec.KYC_failed__c = false;
        conRec.KYC_Completed__c = true;
        conList.add(conRec);
        if(conList.size()>0){
            insert conList;
        }
        
        Lender_Balance__c LB = new Lender_Balance__c();
        LB.Balance__c = 1000;
        LB.Lender__c = conList[0].Id;
        insert LB;
        
        Transaction__c tran = new Transaction__c();
        tran.Amount__c = 25;
        tran.Type__c = 'Donation';
        tran.status__c = 'Completed';
        tran.Lender__c = conList[0].Id;
        
        Test.startTest();
        LWC_AllLoansCtrl.donateFromDashboard(tran);
        Test.stopTest();
    }
     @isTest
    public static void testupdateCommunicationPreference(){
        Contact conRec = new Contact();
        conRec.LastName = 'test1';
        conRec.KYC_Required__c = false;
        conRec.KYC_failed__c = false;
        conRec.KYC_Completed__c = true;
        conRec.Email_Lendwithcare_Opt_Out__c = false;
        insert conRec;
        
        conRec.Email_Lendwithcare_Opt_Out__c = true;
        
        Test.startTest();
        LWC_AllLoansCtrl.updateCommunicationPreference(conRec);
        LWC_AllLoansCtrl.getCommunicationPreferences(conRec.Id);
        Test.stopTest();
    }
    @isTest
    public static void testLoansOnHome(){
        Test.startTest();
        Loan__c loan = [SELECT Id, Borrower__c, Loan_Type__c, Location_of_Business__c FROM Loan__c LIMIT 1];
        LWC_AllLoansCtrl.getAllLoansAndDoc_HomePage();
        LWC_AllLoansCtrl.getAllLoans_HomePage();
        LWC_AllLoansCtrl.getAllLoans( loan.Loan_Type__c, loan.Location_of_Business__c, 'Least To Complete', null, 2);
        LWC_AllLoansCtrl.getAllLoans( loan.Loan_Type__c, loan.Location_of_Business__c, 'Most To Complete', null, 2);
        LWC_AllLoansCtrl.getAllLoans( loan.Loan_Type__c, loan.Location_of_Business__c, 'Oldest Loan', null, 2);
        LWC_AllLoansCtrl.getAllLoans( loan.Loan_Type__c, loan.Location_of_Business__c, 'Most Recent Loan', null, 2);
        LWC_AllLoansCtrl.getAllLoans( loan.Loan_Type__c, loan.Location_of_Business__c, 'Most', null, 2);
        LWC_AllLoansCtrl.updateLoanFundings(loan.Id);
        LWC_AllLoansCtrl.getLoanLendersInformation( loan.Id );
        LWC_AllLoansCtrl.getRelatedLoans( loan.Id, loan.Loan_Type__c );
        LWC_AllLoansCtrl.getLoan(loan.Id);
        LWC_AllLoansCtrl.getAllLoansDev();
        LWC_AllLoansCtrl.getLoanTypeCount(loan.Borrower__c);
        
        Transaction__c tran = new Transaction__c();
        tran.Amount__c = 24;
        tran.Type__c = 'Loan';
        tran.Loan__c = loan.id;
        tran.status__c = 'Held';
        tran.Lender__c = loan.Borrower__c;
        INSERT tran; 
        Cart__c c = new Cart__c(Contact__c=loan.Borrower__c);
        Insert c;
        LWC_AllLoansCtrl.getLoansByStage( 'Held',loan.Borrower__c );
        LWC_AllLoansCtrl.getLoanSchedules( loan.Id );
        LWC_AllLoansCtrl.getLoanDetails( loan.Id );
        LWC_AllLoansCtrl.putContactInfo( loan.Borrower__c, 'Test', 'Test2' );
        LWC_AllLoansCtrl.getContactInfo( loan.Borrower__c );
        LWC_AllLoansCtrl.getImpactInfo();
        LWC_AllLoansCtrl.LWCConfigSettingMetadata( );
        LWC_AllLoansCtrl.getLoanDetailsForCart( new List<Id>{loan.Id} );
        LWC_AllLoansCtrl.getLeastToCompleteLoanRecord( );
        LWC_AllLoansCtrl.createTransactionRecord( new List<Transaction__c>{new Transaction__c(Amount__c = 24,Type__c = 'Loan',Loan__c = loan.id,status__c = 'Held',Lender__c = loan.Borrower__c)} );
        LWC_AllLoansCtrl.updateTransactionRecord( tran );
        LWC_AllLoansCtrl.updateTransactionRecords( new List<Id>{tran.Id}, loan.Borrower__c );
        LWC_AllLoansCtrl.updateTransactionRecordsAfterPayment( new List<Id>{tran.Id}, loan.Borrower__c );
        LWC_AllLoansCtrl.getLoanTypes( );
        LWC_AllLoansCtrl.isGuestUser( );
        LWC_AllLoansCtrl.getMinOtherCurrency( );
        Contact cont = new Contact( Id = loan.Borrower__c, Email_Lendwithcare_Opt_Out__c=false );
        UPDATE cont;
        LWC_AllLoansCtrl.updateCommunicationPreferences( cont );
        LWC_AllLoansCtrl.updateCommunicationPreference( cont );
        cont = new Contact( Id = loan.Borrower__c, Email_Lendwithcare_Opt_Out__c=true );
        UPDATE cont;
        LWC_AllLoansCtrl.updateCommunicationPreference( cont );
        LWC_AllLoansCtrl.updateCommunicationPreferences( cont );
        tran.Type__c = 'Withdrawal';
        UPDATE tran;
        LWC_AllLoansCtrl.getContactInfo( loan.Borrower__c );
        LWC_AllLoansCtrl.getImpactInfo();
        LWC_AllLoansCtrl.putContactInfo( loan.Borrower__c, 'Test', 'Test2' );
        tran.Type__c = 'Donation';
        UPDATE tran;
        LWC_AllLoansCtrl.getContactInfo( loan.Borrower__c );
        LWC_AllLoansCtrl.getImpactInfo();
        LWC_AllLoansCtrl.putContactInfo( loan.Borrower__c, 'Test', 'Test2' );
        
        Map<String,String> nMap = new Map<String,String>();
        nMap.put( 'fromAmount','1' );
        nMap.put( 'toAmount','24' );
        LWC_AllLoansCtrl.getYourTransactionDetails( 'All', loan.Borrower__c, false,'MostRecent', nMap );
        LWC_AllLoansCtrl.getYourTransactionDetails( 'All', loan.Borrower__c, false,'Oldest', nMap );
        //LWC_AllLoansCtrl.getYourTransactionDetails( 'All', loan.Borrower__c, false,'HighestLowest', nMap );
        //LWC_AllLoansCtrl.getYourTransactionDetails( 'All', loan.Borrower__c, false,'LowestHighest', nMap );
        Test.stopTest();
    }
    //Search Loan is covered in homePageCtrlTest
}