import mongoose from 'mongoose';
// import pinyin from 'pinyin';

const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim:true
    },
    chinesename: {
      type: String,
      required: false,
      trim:true
    },
    idNum: {
      type: String,
      required:false,
      trim:true
    },
    height: {
      type: String,
      required:false,
      trim:true
    },
    weight: {
      type: String,
      required:false,
      trim:true
    },
    birthplace: { //籍貫
      type: String,
      required:false,
      trim:true
    },
    body: { //身體是否健全
      type: String,
      required:false,
      trim:true
    },
    tattoo: {
      type:Boolean,
      default: false
    },
    maritalStatus: { 
      type: String,
      required:false,
      trim:true
    },
    spousalRealationship: { 
      type: String,
      required:false,
      trim:true
    },
    NumofChildren: { 
      type: String,
      required:false,
      trim:true
    },
    parentingRelationship: { 
      type: String,
      required:false,
      trim:true
    },
    criminalRecord: { 
      type:Boolean,
      default: false
    },
    caseName: { //案件名稱
      type: String,
      required:false,
      trim:true
    },
    caseDetail: { // 案件詳情，如刑期、緩刑、感化令、假釋等
      type: String,
      required:false,
      trim:true
    },
    address: { 
      type: String,
      required:false,
      trim:true
    },
    phoneNum: { 
      type: String,
      required:false,
      trim:true
    },
    emailAddress: { 
      type: String,
      required:false,
      trim:true
    },
    wechat: { 
      type: String,
      required:false,
      trim:true
    },
    school1: { 
      type: String,
      required:false,
      trim:true
    },
    school1Sert: { 
      type: String,
      required:false,
      trim:true
    },
    school1date: { 
      type: String,
      required:false,
      trim:true
    },
    school2: { 
      type: String,
      required:false,
      trim:true
    },
    school2Sert: { 
      type: String,
      required:false,
      trim:true
    },
    school2date: { 
      type: String,
      required:false,
      trim:true
    },
    post1name: { 
      type: String,
      required:false,
      trim:true
    },
    post1company: { 
      type: String,
      required:false,
      trim:true
    },
    post1salary: { 
      type: String,
      required:false,
      trim:true
    },
    post1date: { 
      type: String,
      required:false,
      trim:true
    },
    post1reason: { 
      type: String,
      required:false,
      trim:true
    },
    post2name: { 
      type: String,
      required:false,
      trim:true
    },
    post2company: { 
      type: String,
      required:false,
      trim:true
    },
    post2salary: { 
      type: String,
      required:false,
      trim:true
    },
    post2date: { 
      type: String,
      required:false,
      trim:true
    },
    post2reason: { 
      type: String,
      required:false,
      trim:true
    },
    employmentPost: {  //公開就業職位
      type: String,
      required:false,
      trim:true
    },
    expactEmploymentPost: {  //期望工作職位
      type: String,
      required:false,
      trim:true
    },
    expactSalary: { 
      type: String,
      required:false,
      trim:true
    },
    strengths: { 
      type: String,
      required:false,
      trim:true
    },
    interest: { 
      type: String,
      required:false,
      trim:true
    },
    skillSert: { 
      type: String,
      required:false,
      trim:true
    },
    cantonese: { 
      type: String,
      required:false,
      trim:true
    },
    mandarin: {  //國語
      type: String,
      required:false,
      trim:true
    },
    english: { 
      type: String,
      required:false,
      trim:true
    },
    portuguese: { 
      type: String,
      required:false,
      trim:true
    },
    word: { 
      type: String,
      required:false,
      trim:true
    },
    excel: { 
      type: String,
      required:false,
      trim:true
    },
    powerpoint: { 
      type: String,
      required:false,
      trim:true
    },
    chineseType: { 
      type: String,
      required:false,
      trim:true
    },
    drivingLicense: { 
      type: String,
      required:false,
      trim:true
    },
    gambling: { 
      type: String,
      required:false,
      trim:true
    },
    drinking: { 
      type: String,
      required:false,
      trim:true
    },
    internet: { 
      type: String,
      required:false,
      trim:true
    },
    otherBadHabit: { 
      type: String,
      required:false,
      trim:true
    },
    ketUsageMethod: { 
      type: String,
      required:false,
      trim:true
    },
    ketExpend: { 
      type: String,
      required:false,
      trim:true
    },
    ketYearBegin: { //開始濫用該藥物之年齡
      type: String,
      required:false,
      trim:true
    },
    ketFrequency: { 
      type: String,
      required:false,
      trim:true
    },
    metUsageMethod: { 
      type: String,
      required:false,
      trim:true
    },
    metExpend: { 
      type: String,
      required:false,
      trim:true
    },
    metYearBegin: { //開始濫用該藥物之年齡
      type: String,
      required:false,
      trim:true
    },
    metFrequency: { 
      type: String,
      required:false,
      trim:true
    },
    drug3month: {  //最近3個月
      type: String,
      required:false,
      trim:true
    },
    drug6month: { 
      type: String,
      required:false,
      trim:true
    },
    drug12month: { 
      type: String,
      required:false,
      trim:true
    },
    yearOfFirstAdict: { 
      type: String,
      required:false,
      trim:true
    },
    NameOfFirstAdict: { 
      type: String,
      required:false,
      trim:true
    },
    areaOfAdict: {  //吸毒地區
      type: String,
      required:false,
      trim:true
    },
    placeOfAdict: {  //吸毒地點
      type: String,
      required:false,
      trim:true
    },
    reasonOfAdict: {  //吸毒原因
      type: String,
      required:false,
      trim:true
    },
    shareAyringe: {  //共用針筒
      type:Boolean,
      default: false
    },
    smoke: {  
      type:Boolean,
      default: false
    },
    bodyStatus: {  //身體狀況
      type: String,
      required:false,
      trim:false
    },
    psychiatry: {  //接受精神科
      type: String,
      required:false,
      trim:true
    },
    infectiiousDiseases: {  
      type: String,
      required:false,
      trim:true
    },
    follower: {  
      type: String,
      required:false,
      trim:true
    },
    adictFmily: {  
      type:Boolean,
      default: false
    },
    seeOthersAdict: {  
      type:Boolean,
      default: false
    },
    seeOthersAdictDetail: {   //目賭其他人吸毒
      type: String,
      required:false,
      trim:true
    },
    joinClass: {  
      type:Boolean,
      default: false
    },
    adict: {  
      type:Boolean,
      default: false
    },
    birthday: {
        type: String,
        required: true,
        trim:true
      },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    gender: {
      type: String,
      required:false,
      trim:true
    },
    comefrom: { //籍貫
      type: String,
      required:false,
      trim:true
    }, //個案來源
    refferWorker: {
      type: String,
      required:false,
      trim:true
    },
    refferWorkerTel: {
      type: String,
      required:false,
      trim:true
    },
    registrationDate: {
      type: String,
      required:false,
      trim:true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);



const Client = mongoose.model('Client', clientSchema);

export default Client;