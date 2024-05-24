import { Button, Spinner,Table } from 'flowbite-react';
import { useEffect, useState,useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {useReactToPrint} from "react-to-print"
import { useSelector} from 'react-redux'


export default function ClientPage() {
  const { clientSlug } = useParams();
  const {currentUser} = useSelector((state) => state.user)
  const [filteredClients, setFilteredClients] = useState([]);
  const [userClients, setUserClients] = useState([])

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [client, setClient] = useState(null);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client/getclients?slug=${clientSlug}`);
        const data = await res.json();
        // console.log(data);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setClient(data.clients[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientSlug]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`/api/client/getclients`)
        const data = await res.json()

        if(res.ok) {
          setUserClients(data.clients)
          if(data.clients.length < 9){
            setShowMore(false)
          }
        }
        
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin) {
      fetchClients()
    }
  },[currentUser._id])

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  return (
    <main  className='p-3 mx-auto min-h-screen px-5'>
      <div ref={componentRef} className='p-3 px-6 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl mb-2  text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
          申請表
        </h1>
        <p className='mb-2'>個案來源（康復處／重返廳／機構／自行申請／其他）：{client && client.refferFrom}</p>
        <div className='flex justify-between mb-2'>
          <p>轉介社工：{client && client.refferWorker}</p>
          <p>轉介社工聯絡電話：{client && client.refferWorkerTel}</p>
          <p>填表日期：{client && client.registrationDate}</p>
        </div>
        <div className='mb-3'>
          <p className='mb-1'>基本資料：</p>
          <div className='flex justify-between border'>
            <div className='w-1/3 p-2 flex justify-center'>
              <img
                src={client && client.image}
                alt={client && client.name}
                className='p-3 max-h-[600px] w-30 object-cover h-40 '
              />
            </div>
            <div className='flex flex-col justify-evenly w-1/3 p-2 '>
              <p>中文姓名：{client && client.chinesename}</p>
              <p>外文姓名：{client && client.name} </p>
              <p>身份證號碼：{client && client.idNum}</p>
              <div className='flex gap-2'>
                <p>身高：{client && client.height}米</p> |
                <p>體重：{client && client.weight}公斤</p>
              </div>
            </div>
            <div className='flex flex-col justify-evenly w-1/3 p-2 '>
              <div className='flex gap-4'>
                <p>性別：{client && client.gender}</p>
                <p>籍貫：{client && client.birthplace}</p>
              </div>
              <p>出生日期：{client && client.birthday}</p>
              <p>身體：{client && client.body}</p>
              <p>紋身：{client && client.tattoo}</p>
            </div>
          </div>
          
        </div>
        <div className='mb-3'>
          <p className='mb-1'>犯罪記錄：</p>
            <div className='flex justify-around p-2 outline'>
              <p classname="w-1/4">是否有犯罪記錄：{client && client.criminalRecord}</p>
              <p classname="w-1/4">案件名稱：{client && client.caseName} </p>
{/*               <p>詳情（刑期、緩刑、感化令、假釋）：{client && client.caseDetail }</p> */}
              <div
                className='w-1/2'
                dangerouslySetInnerHTML={{ __html: client && client.caseDetail }}
              ></div> 
            </div>
        </div>

        <div className='mb-3'>
          <p className='mb-1'>家庭關係：</p>
          <div className='flex justify-around outline'>
            <div className='flex flex-col justify-evenly w-1/3 p-2 '>
              <p>婚姻狀況：{client && client.maritalStatus}</p>
              <p>子女數目：{client && client.NumofChildren} </p>
            </div>
            <div className='flex flex-col justify-evenly w-1/3 p-2 '>
              <p>配偶關係（良好／一般／惡劣）：{client && client.spousalRealationship}</p>
              <p>父母關係（良好／一般／惡劣）：{client && client.parentingRelationship}</p>
            </div>
          </div>
        </div>

        <div className='mb-3'>
          <p className='mb-1'>聯絡資訊：</p>
          <div className='flex justify-around outline'>
            <div className='flex flex-col justify-evenly w-2/3 p-2 '>
              <p>住址：{client && client.address}</p>
              <p>電郵：{client && client.emailAddress} </p>
            </div>
            <div className='flex flex-col justify-evenly w-1/3 p-2 '>
              <p>電話：{client && client.phoneNum}</p>
              <p>微信：{client && client.wechat}</p>
            </div>
          </div>
        </div>

        <div className='mb-3'>
          <p className='mb-1'>學歷：</p>
          <div className='outline'> 
          <div className='flex justify-evenly p-2  '>
              <p>學校名稱（註明日間或夜間）：{client && client.school1}</p>
              <p>教育程度：{client && client.school1Sert} </p>
              <p>就讀期間：{client && client.school1date} </p>
            </div>
            <div className='flex justify-evenly p-2  '>
              <p>學校名稱（註明日間或夜間）：{client && client.school2}</p>
              <p>教育程度：{client && client.school2Sert} </p>
              <p>就讀期間：{client && client.school2date} </p>
            </div>
          </div>
            
        </div>

        <div className='mb-3'>
          <p className='mb-1'>工作經驗及要求：</p>
          <div className='outline'>
            <div className='flex justify-between p-2  '>
                <p>職稱：{client && client.post1name}</p>
                <p>公司名稱：{client && client.post1company} </p>
                <p>薪金：{client && client.post1salary} </p>
                <p>起始年月：{client && client.post1date} </p>
                <p>離職原因：{client && client.post1reason} </p>
              </div>
              <div className='flex justify-between p-2  '>
                <p>職稱：{client && client.post2name}</p>
                <p>公司名稱：{client && client.post2company} </p>
                <p>薪金：{client && client.post2salary} </p>
                <p>起始年月：{client && client.post2date} </p>
                <p>離職原因：{client && client.post2reason} </p>
              </div>
              <div className='flex justify-between p-2'>
                <p>公開就業職位：{client && client.employmentPost}</p>
                <p>期望工作職位：{client && client.expactEmploymentPost}</p>
                <p>期望薪資：{client && client.expactSalary}</p>
              </div>
          </div>
        </div>

        <div className='mb-20'>
          <p className='mb-1'>個人才能：</p>
          <div className='outline'>
            <div className='flex flex-col justify-between p-2  '>
                <p>專長：{client && client.strengths}</p>
                <p>興趣：{client && client.interest} </p>
                <p>專業技術證書：{client && client.skillSert} </p>
            </div> 
          </div>
        </div>

        <div className='mb-3'>
          <p className='mb-1'>語言能力：</p>
          <div className='outline flex justify-evenly'> 
              <div className='flex flex-col justify-between p-2  '>
                <p>粵語：{client && client.cantonese}</p> 
                <p>國語：{client && client.mandarin} </p>
                <p>英語：{client && client.english} </p>
                <p>葡語：{client && client.portuguese} </p>
              </div>
              <div className='flex flex-col justify-between p-2  '>
                <p>聽寫：{client && client.listenAndWriting}</p>
                <p>速記：{client && client.shorthand} </p>
                <p>中文輸入：{client && client.chineseType} </p>
              </div>
              <div className='flex flex-col justify-between p-2'>
                <h1 className='text-center underline'>文書處理</h1>
                <div>
                  <p>Word：{client && client.word}</p>
                  <p>Excel：{client && client.excel}</p>
                  <p>PowerPoint：{client && client.powerpoint}</p>
                </div>
              </div>
          </div>
        </div>

        <div className='mb-3'> 
          <p className='mb-1'>其他：</p>
          <div className='outline'>
            <div className='flex justify-between p-2  '>
                <p>駕照（貨櫃車／大巴士／巴士／貨車／小車／電單車／無）：{client && client.drivingLicense}</p>
                <p>關於駕照的其他詳情：{client && client.drivingDetail} </p> 
            </div>
          </div>
        </div>
      
        <div className='mb-3'> 
          <p className='mb-1'>個人習慣：</p>
          <div className='flex flex-col outline'>
            <div className='flex justify-evenly p-2  '>
                <p>賭博（高／中／低／沒有）：{client && client.gambling}</p>
                <p>上網（高／中／低／沒有）：{client && client.internet}</p>
            </div>
            <div className='flex justify-evenly p-2  '>
                <p>酗酒（高／中／低／沒有）：{client && client.drinking}</p>
                <p>其他：{client && client.otherBadHabit}</p>
            </div>
          </div>
        </div>

        <div className='mb-3'> 
          <div className='flex justify-between'>
            <p className='mb-1'>濫藥情況：</p>
            <p>曾經濫藥（是 / 否）：{client && client.adict}</p>
          </div>

          <Table className='outline'>
            <Table.Head>
              <Table.HeadCell>毒品名稱</Table.HeadCell>
              <Table.HeadCell>通常使用該毒品的方法</Table.HeadCell>
              <Table.HeadCell>通常每月開支（MOP）</Table.HeadCell>
              <Table.HeadCell>開始濫用該毒品之年齡</Table.HeadCell>
              <Table.HeadCell>頻率</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell className='py-0'>
                  K仔
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.ketUsageMethod}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.ketExpend}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.ketYearBegin}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.ketFrequency}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className='py-0'>
                  冰毒
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.metUsageMethod}
                </Table.Cell >
                <Table.Cell className='py-0'>
                  {client && client.metExpend}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.metYearBegin}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.metFrequency}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className='py-0'>
                  可卡因
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.cocUsageMethod}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.cocExpend}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.cocYearBegin}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.cocFrequency}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className='py-0'>
                  大麻
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.marUsageMethod}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.marExpend}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.marYearBegin}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.marFrequency}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className='py-0'>
                  海洛因
                </Table.Cell >
                <Table.Cell className='py-0'>
                  {client && client.heroinUsageMethod}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.heroinExpend}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.heroinYearBegin}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.heroinFrequency}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className='py-0'>
                {client && client.otherDrugname}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.otherUsageMethod}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.otherExpend}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.otherYearBegin}
                </Table.Cell>
                <Table.Cell className='py-0'>
                  {client && client.otherFrequency}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <p>註1. 如填其他，請註明毒品名稱</p>
          <p>註2. 1.靜脈注射   2.肌肉注射  3.以香煙或煙管吸食 4.追龍 5.口服 6.鼻服 7.無一定方式 8.不詳 9.其他</p>
        </div>

        <div className='mb-3'> 
          <p className='mb-1'>最近一次濫用毒品時間(單選)：</p>
          <div className='flex flex-col outline'>
            <div className='flex justify-between p-2  '>
              <p>請填寫最近3個月(1-3個月) 或 最近6個月(3個月以上至6個月) 或 最近12個月(6個月以上至12個月):☐</p>
                <p>{client && client.drug3month}</p>
                <p>{client && client.drug6month}</p>
                <p>{client && client.drug12month}</p>
            </div>
            <div className='flex p-2'>
              <p>首次吸毒的年齡 <u>15{client && client.yearOfFirstAdict}</u> 歲 ，濫用毒品為: <u>冰{client && client.NameOfFirstAdict}</u> </p>
            </div>
            <div className='flex justify-between p-2'>
              <p>吸毒的地區： <u>澳門{client && client.areaOfAdict}</u>，  </p> 
              <p>吸毒的地點： <u>家中{client && client.placeOfAdict}</u>，  </p>
              <p>吸毒厡因: <u>朋友影響{client && client.reasonOfAdict}</u></p>
            </div>
            <div className='flex justify-between p-2'>
              <p>有否與別人共用針筒: <u>有{client && client.shareAyringe}</u>，  </p> 
              <p>目前是否吸煙: <u>是{client && client.smoke}</u>，  </p>
              <p>現時身體情況: <u>正常{client && client.bodyStatus}</u></p>
            </div>
            <div className='flex justify-between p-2'>
              <p>曾/接受精神科或心理治療服務: <u>有{client && client.psychiatry}</u></p>
              <p>曾/患有傳染性的疾病: <u>皮膚病{client && client.infectiiousDiseases}</u></p>
            </div>
          </div>
        </div>

        <div className='mb-3'> 
          <p className='mb-1'>生活圈是否認識有人接觸毒品</p>
          <div className='flex flex-col outline'>
            
            <div className='flex justify-between p-1'>
              <p>家人有否吸毒: <u>有{client && client.adictFmily}</u> </p>
              <p>有否目睹其他人吸毒: <u>有{client && client.seeOthersAdict}</u> </p>
              <p>如果有，請填寫： <u>朋友{client && client.seeOthersAdictDetail}</u> </p>
            </div>
            
          </div>
        </div>

        <div className='mb-3'> 
          <p className='mb-1'>是否參與挪亞青年成長發展中心舉辦的小組、健康生活講座及工作坊：{client && client.joinClass}</p>
          <p>備註：此資料僅作職業配對之用，與本中心並不存在僱傭關係  </p>
        </div>


        
        {/* <div
          className='p-3 max-w-2xl mx-auto w-full post-content'
          dangerouslySetInnerHTML={{ __html: client && client.description }}
        ></div> */}
      </div>
      <div className='flex justify-center mb-10'>
        <Button
          onClick={handlePrint}
          outline gradientDuoTone='purpleToBlue'
        >
          下載檔案
        </Button>
      </div>
    </main>
  );
}
