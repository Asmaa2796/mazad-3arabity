import { IconFileCertificate, IconList, IconLocation } from '@tabler/icons-react';
import style from './about.module.css';
const About = () => {
    return (
        <div className={`${style.about} py-5 bg-light`}>
            <div className='container'>
                <div className={`${style.about_text}`}>
                    <h5 className='fw-medium'><IconList className='sub-color'/> عن مزاد عربيتي</h5>
                    <p className='text-secondary lh-base'>
                        هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
                        إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما .
                    </p>
                    <hr className='my-4'/>
                    <h5 className='fw-medium'><IconFileCertificate className='sub-color'/> شراكتنا</h5>
                    <p className='text-secondary lh-base'>
                        هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
                        إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما .
                    </p>
                    <hr className='my-4'/>
                    <h5 className='fw-medium'><IconLocation className='sub-color'/> موقعنا الجغرافي</h5>
                    <p className='text-secondary lh-base'>
                        هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
                        إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما .
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;