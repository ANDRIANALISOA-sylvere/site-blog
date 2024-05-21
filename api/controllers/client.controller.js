import Client from '../models/client.model.js';
import { errorHandler } from '../utils/error.js';


export const createClient = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a client'));
  }

  if (!req.body.name || !req.body.description || !req.body.birthday || !req.body.gender) {
    return next(errorHandler(400, 'Please provide all required client fields'));
  }

  const slug = req.body.name
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '')
  const newClient = new Client({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    next(error);
  }
};

export const getclients = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const clients = await Client.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.gender && { gender: req.query.gender }),
      ...(req.query.name && { name: req.query.name }),
      ...(req.query.refferFrom && { refferFrom: req.query.refferFrom }),
      ...(req.query.chinesename && { chinesename: req.query.chinesename }),
      ...(req.query.birthday && { birthday: req.query.birthday }),
      ...(req.query.follower && { follower: req.query.follower }),
      ...(req.query.adict && { adict: req.query.adict }),
      ...(req.query.description && { description: req.query.description }),

      ...(req.query.idNum && { idNum: req.query.idNum }),
      ...(req.query.height && { height: req.query.height }),
      ...(req.query.weight && { weight: req.query.weight }),
      ...(req.query.body && { body: req.query.body }),
      ...(req.query.birthplace && { birthplace: req.query.birthplace }),
      ...(req.query.tattoo && { tattoo: req.query.tattoo }),
      ...(req.query.maritalStatus && { maritalStatus: req.query.maritalStatus }),
      ...(req.query.spousalRealationship && { spousalRealationship: req.query.spousalRealationship }),
      ...(req.query.NumofChildren && { NumofChildren: req.query.NumofChildren }),
      ...(req.query.parentingRelationship && { parentingRelationship: req.query.parentingRelationship }),
      ...(req.query.criminalRecord && { criminalRecord: req.query.criminalRecord }),
      ...(req.query.caseName && { caseName: req.query.caseName }),
      ...(req.query.caseDetail && { caseDetail: req.query.caseDetail }),
      ...(req.query.address && { address: req.query.address }),
      ...(req.query.phoneNum && { phoneNum: req.query.phoneNum }),
      ...(req.query.emailAddress && { emailAddress: req.query.emailAddress }),
      ...(req.query.wechat && { wechat: req.query.wechat }),
      ...(req.query.school1Sert && { school1Sert: req.query.school1Sert }),
      ...(req.query.school1date && { school1date: req.query.school1date }),
      ...(req.query.school2 && { school2: req.query.school2 }),
      ...(req.query.school2Sert && { school2Sert: req.query.school2Sert }),
      ...(req.query.school2date && { school2date: req.query.school2date }),
      ...(req.query.post1name && { post1name: req.query.post1name }),
      ...(req.query.post1company && { post1company: req.query.post1company }),
      ...(req.query.post1salary && { post1salary: req.query.post1salary }),
      ...(req.query.post1date && { post1date: req.query.post1date }),
      ...(req.query.post1reason && { post1reason: req.query.post1reason }),
      ...(req.query.post2name && { post2name: req.query.post2name }),
      ...(req.query.post2company && { post2company: req.query.post2company }),
      ...(req.query.post2salary && { post2salary: req.query.post2salary }),
      ...(req.query.post2date && { post2date: req.query.post2date }),
      ...(req.query.post2reason && { post2reason: req.query.post2reason }),
      ...(req.query.employmentPost && { employmentPost: req.query.employmentPost }),
      ...(req.query.expactEmploymentPost && { expactEmploymentPost: req.query.expactEmploymentPost }),
      ...(req.query.expactSalary && { expactSalary: req.query.expactSalary }),
      ...(req.query.strengths && { strengths: req.query.strengths }),
      ...(req.query.interest && { interest: req.query.interest }),
      ...(req.query.skillSert && { skillSert: req.query.skillSert }),
      ...(req.query.cantonese && { cantonese: req.query.cantonese }),
      ...(req.query.mandarin && { mandarin: req.query.mandarin }),
      ...(req.query.english && { english: req.query.english }),
      ...(req.query.portuguese && { portuguese: req.query.portuguese }),
      ...(req.query.listenAndWriting && { listenAndWriting: req.query.listenAndWriting }),
      ...(req.query.shorthand && { shorthand: req.query.shorthand }),
      ...(req.query.word && { word: req.query.word }),
      ...(req.query.excel && { excel: req.query.excel }),
      ...(req.query.powerpoint && { powerpoint: req.query.powerpoint }),
      ...(req.query.drivingLicense && { drivingLicense: req.query.drivingLicense }),
      ...(req.query.gambling && { gambling: req.query.gambling }),
      ...(req.query.drinking && { drinking: req.query.drinking }),
      ...(req.query.internet && { internet: req.query.internet }),
      ...(req.query.otherBadHabit && { otherBadHabit: req.query.otherBadHabit }),
      ...(req.query.ketUsageMethod && { ketUsageMethod: req.query.ketUsageMethod }),
      ...(req.query.ketExpend && { ketExpend: req.query.ketExpend }),
      ...(req.query.ketYearBegin && { ketYearBegin: req.query.ketYearBegin }),
      ...(req.query.ketFrequency && { ketFrequency: req.query.ketFrequency }),
      ...(req.query.metUsageMethod && { metUsageMethod: req.query.metUsageMethod }),
      ...(req.query.metExpend && { metExpend: req.query.metExpend }),
      ...(req.query.metYearBegin && { metYearBegin: req.query.metYearBegin }),
      ...(req.query.metFrequency && { metFrequency: req.query.metFrequency }),
      ...(req.query.drug3month && { drug3month: req.query.drug3month }),
      ...(req.query.drug6month && { drug6month: req.query.drug6month }),
      ...(req.query.drug12month && { drug12month: req.query.drug12month }),
      ...(req.query.yearOfFirstAdict && { yearOfFirstAdict: req.query.yearOfFirstAdict }),
      ...(req.query.NameOfFirstAdict && { NameOfFirstAdict: req.query.NameOfFirstAdict }),
      ...(req.query.areaOfAdict && { areaOfAdict: req.query.areaOfAdict }),
      ...(req.query.placeOfAdict && { placeOfAdict: req.query.placeOfAdict }),
      ...(req.query.reasonOfAdict && { reasonOfAdict: req.query.reasonOfAdict }),
      ...(req.query.shareAyringe && { shareAyringe: req.query.shareAyringe }),
      ...(req.query.smoke && { smoke: req.query.smoke }),
      ...(req.query.bodyStatus && { bodyStatus: req.query.bodyStatus }),
      ...(req.query.psychiatry && { psychiatry: req.query.psychiatry }),
      ...(req.query.infectiiousDiseases && { infectiiousDiseases: req.query.infectiiousDiseases }),
      ...(req.query.adictFmily && { adictFmily: req.query.adictFmily }),
      ...(req.query.seeOthersAdict && { seeOthersAdict: req.query.seeOthersAdict }),
      ...(req.query.seeOthersAdictDetail && { seeOthersAdictDetail: req.query.seeOthersAdictDetail }),
      ...(req.query.joinClass && { joinClass: req.query.joinClass }),
      ...(req.query.comefrom && { comefrom: req.query.comefrom }),
      ...(req.query.refferWorker && { refferWorker: req.query.refferWorker }),
      ...(req.query.refferWorkerTel && { refferWorkerTel: req.query.refferWorkerTel }),
      ...(req.query.registrationDate && { registrationDate: req.query.registrationDate }),



      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.clientId && { _id: req.query.clientId }),
      ...(req.query.searchClientTerm && {
        $or: [
          { name: { $regex: req.query.searchClientTerm, $options: 'i' } },
          { chinesename: { $regex: req.query.searchClientTerm, $options: 'i' } },
          { gender: { $regex: req.query.searchClientTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalClients = await Client.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthClients = await Client.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      clients,
      totalClients,
      lastMonthClients,
    });
  } catch (error) {
    next(error);
  }
  // res.send("get clients")
};

export const deleteclient = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this client'));
  }
  try {
    await Client.findByIdAndDelete(req.params.clientId);
    res.status(200).json('The client has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updateclient = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this client'));
  }
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.clientId,
      {
        $set: {
          name: req.body.name,
          refferFrom: req.body.refferFrom,
          chinesename:req.body.chinesename,
          birthday: req.body.birthday,
          gender: req.body.gender,
          follower: req.body.follower,
          adict: req.body.adict,
          description:req.body.description,
          image: req.body.image,
          idNum: req.body.idNum,
          height: req.body.height,
          weight: req.body.weight,
          birthplace: req.body.birthplace,
          body: req.body.body,
          tattoo: req.body.tattoo,
          maritalStatus: req.body.maritalStatus,
          spousalRealationship: req.body.spousalRealationship,
          NumofChildren: req.body.NumofChildren,
          parentingRelationship: req.body.parentingRelationship,
          criminalRecord: req.body.criminalRecord,
          caseName: req.body.caseName,
          caseDetail: req.body.caseDetail,
          address: req.body.address,
          phoneNum: req.body.phoneNum,
          emailAddress: req.body.emailAddress,
          wechat: req.body.wechat,
          school1: req.body.school1,
          school1Sert: req.body.school1Sert,
          school1date: req.body.school1date,
          school2: req.body.school2,
          school2Sert: req.body.school2Sert,
          school2date: req.body.school2date,
          post1name: req.body.post1name,
          post1company: req.body.post1company,
          post1salary: req.body.post1salary,
          post1date: req.body.post1date,
          post1reason: req.body.post1reason,
          post2name: req.body.post2name,
          post2company: req.body.post2company,
          post2salary: req.body.post2salary,
          post2date: req.body.post2date,
          post2reason: req.body.post2reason,
          employmentPost: req.body.employmentPost,
          expactEmploymentPost: req.body.expactEmploymentPost,
          expactSalary: req.body.expactSalary,
          strengths: req.body.strengths,
          interest: req.body.interest,
          skillSert: req.body.skillSert,
          cantonese: req.body.cantonese,
          mandarin: req.body.mandarin,
          english: req.body.english,
          portuguese: req.body.portuguese,
          listenAndWriting: req.body.listenAndWriting,
          shorthand: req.body.shorthand,
          word: req.body.word,
          excel: req.body.excel,
          powerpoint: req.body.powerpoint,
          chineseType: req.body.chineseType,
          drivingLicense: req.body.drivingLicense,
          gambling: req.body.gambling,
          drinking: req.body.drinking,
          internet: req.body.internet,
          otherBadHabit: req.body.otherBadHabit,
          ketUsageMethod: req.body.ketUsageMethod,
          ketExpend: req.body.ketExpend,
          ketYearBegin: req.body.ketYearBegin,
          ketFrequency: req.body.ketFrequency,
          metUsageMethod: req.body.metUsageMethod,
          metExpend: req.body.metExpend,
          metYearBegin: req.body.metYearBegin,
          metFrequency: req.body.metFrequency,
          drug3month: req.body.drug3month,
          drug6month: req.body.drug6month,
          drug12month: req.body.drug12month,
          yearOfFirstAdict: req.body.yearOfFirstAdict,
          NameOfFirstAdict: req.body.NameOfFirstAdict,
          areaOfAdict: req.body.areaOfAdict,
          placeOfAdict: req.body.placeOfAdict,
          reasonOfAdict: req.body.reasonOfAdict,
          shareAyringe: req.body.shareAyringe,
          bodyStatus: req.body.bodyStatus,
          smoke: req.body.smoke,
          psychiatry: req.body.psychiatry,
          infectiiousDiseases: req.body.infectiiousDiseases,
          adictFmily: req.body.adictFmily,
          seeOthersAdict: req.body.seeOthersAdict,
          seeOthersAdictDetail: req.body.seeOthersAdictDetail,
          joinClass: req.body.joinClass,
          comefrom: req.body.comefrom,
          refferWorker: req.body.refferWorker,
          refferWorkerTel: req.body.refferWorkerTel,
          registrationDate: req.body.registrationDate,
   

        },
      },
      { new: true }
    );
    res.status(200).json(updatedClient);
  } catch (error) {
    next(error);
  }
};