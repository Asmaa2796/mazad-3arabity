import { IconCheckFilled, IconList, IconUser } from '@tabler/icons-react';
import style from './TermsConditions.module.css';
const TermsConditions = () => {
    return (
        <div className={`${style.terms_conditions} py-5 bg-light`}>
            <div className='container'>
                <div className={`${style.terms_conditions_text}`}>
                    <h5 className='fw-medium'><IconList className='sub-color'/> الشروط والاستخدام</h5>
                    <p className='text-secondary lh-base'>
                        هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
                        إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما .
                    </p>
                    <hr className='my-4'/>
                    <h5 className='fw-medium'><IconCheckFilled className='sub-color'/> الموافقة على الشروط</h5>
                    <p className='text-secondary lh-base'>
                        هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
                        إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما .
                    </p>
                    <hr className='my-4'/>
                    <h5 className='fw-medium'><IconUser className='sub-color'/> سلوك المستخدم </h5>
                    <p className='text-secondary lh-base'>
                        هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
                        إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما .
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TermsConditions;