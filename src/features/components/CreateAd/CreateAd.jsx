import { useEffect, useRef, useState } from 'react';
import Stepper from 'bs-stepper';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import style from './CreateAd.module.css';
import { IconClipboardText, IconGavel, IconLibraryPhoto, IconPhoto } from '@tabler/icons-react';

const CreateAd = () => {
    const stepperRef = useRef(null);

    const [formData, setFormData] = useState({
        brand: '',
    });

    const [errors, setErrors] = useState({});

    const validateStep = (step) => {
        let stepErrors = {};
        if (step === 1 && !formData.brand.trim()) {
            stepErrors.brand = 'هذا الحقل مطلوب';
        }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const handleNext = (step) => {
        if (validateStep(step)) stepperRef.current.next();
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        stepperRef.current = new Stepper(document.querySelector('#stepper'), {
            linear: true, 
            animation: true,
        });

        const headers = document.querySelectorAll('#stepper .step-trigger');
        headers.forEach(header => {
            header.style.pointerEvents = 'none';
        });
    }, []);

    return (
        <div className={`${style.create_ad} py-5`}>
            <div className="container">
                <h4 className="fw-medium mb-4">إضافة إعلان عن مزاد</h4>

                <div id="stepper" className="bs-stepper">
                    {/* Step Headers */}
                    <div className="bs-stepper-header" role="tablist">
                        <div className="step" data-target="#step-1">
                            <button type="button" className="step-trigger" role="tab" aria-controls="step-1">
                                <span className="bs-stepper-circle">1</span>
                                <span className="bs-stepper-label">معلومات المزاد</span>
                            </button>
                        </div>
                        <div className="line"></div>
                        <div className="step" data-target="#step-2">
                            <button type="button" className="step-trigger" role="tab" aria-controls="step-2">
                                <span className="bs-stepper-circle">2</span>
                                <span className="bs-stepper-label">صور السيارة</span>
                            </button>
                        </div>
                        <div className="line"></div>
                        <div className="step" data-target="#step-3">
                            <button type="button" className="step-trigger" role="tab" aria-controls="step-3">
                                <span className="bs-stepper-circle">3</span>
                                <span className="bs-stepper-label">بيانات المزاد</span>
                            </button>
                        </div>
                    </div>

                    {/* Step Contents */}
                    <div className="bs-stepper-content mt-4">
                        {/* Step 1 */}
                        <div id="step-1" className="content" role="tabpanel">
                            <b className='d-flex align-items-center'><IconClipboardText size={20} stroke={1} className='main-color'/> المعلومات الأساسية</b>
                            <p>أدخل المعلومات الأساسية للسيارة لبدء إنشاء الإعلان.</p>
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                                    <label className='mb-2'>الماركة</label>
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.brand ? 'is-invalid' : ''}`}
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="ادخل الماركة"
                                    />
                                    {errors.brand && <div className="invalid-feedback my-2">{errors.brand}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                                    <label className='mb-2'>الموديل</label>
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.model ? 'is-invalid' : ''}`}
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        placeholder="مثال : C 180"
                                    />
                                    {errors.model && <div className="invalid-feedback my-2">{errors.model}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                                    <label className='mb-2'>سنة الصنع</label>
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.makeYear ? 'is-invalid' : ''}`}
                                        name="makeYear"
                                        value={formData.makeYear}
                                        onChange={handleChange}
                                        placeholder="مثال : 2024"
                                    />
                                    {errors.makeYear && <div className="invalid-feedback mb-2">{errors.makeYear}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                                    <label className='mb-2'>الموقع</label>
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.location ? 'is-invalid' : ''}`}
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="مثال : مصر"
                                    />
                                    {errors.location && <div className="invalid-feedback my-2">{errors.location}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                                    <label className='mb-2'>المدينة </label>
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.city ? 'is-invalid' : ''}`}
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="مثال : القاهرة"
                                    />
                                    {errors.city && <div className="invalid-feedback my-2">{errors.city}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                                    <label className='mb-2'>الحي </label>
                                    <input
                                        type="text"
                                        className={`form-control mb-2 ${errors.area ? 'is-invalid' : ''}`}
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        placeholder="مثال : حي حلوان"
                                    />
                                    {errors.area && <div className="invalid-feedback my-2">{errors.area}</div>}
                                </div>
                                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                                    <label className='mb-2'>وصف المنتج بالتفصيل</label>
                                    <textarea
                                        className={`form-control mb-2 ${errors.description ? 'is-invalid' : ''}`}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="النوع/ الحالة/ حالة النظام/ تلميحة"
                                    />
                                    {errors.description && <div className="invalid-feedback my-2">{errors.description}</div>}
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div></div> {/* Empty div for alignment */}
                                    <button className="btn btn-main-color" onClick={() => handleNext(1)}>التالي</button>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div id="step-2" className="content" role="tabpanel">
                            <b><IconLibraryPhoto className='main-color' stroke={1} size={20}/> أضف صور السيارة</b>
                            <p>قم بالتقاط أو تحميل صور للسيارة التي ترغب في بيعها</p>
                            <div className="mb-3">
                                <div className='row'>
                                    <div className='col-xl-12 col-lg-12 col-md-12 col-12'>
                                        <label className='mb-2'>الصوره الرئيسية</label>
                                    </div>
                                    <div className='col-xl-12 col-lg-12 col-md-12 col-12'>
                                        <div className={style.car_images}>
                                            <input type='file' />
                                            <IconPhoto />
                                            <span>برجاء إضافة الصورة </span>
                                        </div>
                                    </div>
                                    <div className='col-xl-12 col-lg-12 col-md-12 col-12'>
                                        <label className='mb-2'>الصور الأخرى</label>
                                    </div>
                                    <div className='col-xl-3 col-lg-3 col-md-6 col-12'>
                                        <div className={style.car_images}>
                                            <input type='file' />
                                            <IconPhoto />
                                            <span>برجاء إضافة الصورة </span>
                                        </div>
                                    </div>
                                    <div className='col-xl-3 col-lg-3 col-md-6 col-12'>
                                        <div className={style.car_images}>
                                            <input type='file' />
                                            <IconPhoto />
                                            <span>برجاء إضافة الصورة </span>
                                        </div>
                                    </div>
                                    <div className='col-xl-3 col-lg-3 col-md-6 col-12'>
                                        <div className={style.car_images}>
                                            <input type='file' />
                                            <IconPhoto />
                                            <span>برجاء إضافة الصورة </span>
                                        </div>
                                    </div>
                                    <div className='col-xl-3 col-lg-3 col-md-6 col-12'>
                                        <div className={style.car_images}>
                                            <input type='file' />
                                            <IconPhoto />
                                            <span>برجاء إضافة الصورة </span>
                                        </div>
                                    </div>
                                    <div className='col-xl-12 col-lg-12 col-md-12 col-12'>
                                        <label className='mb-2'>صور الرخصة</label>
                                    </div>
                                    <div className='col-xl-6 col-lg-6 col-md-6 col-12'>
                                        <div className={style.car_images}>
                                            <input type='file' />
                                            <IconPhoto />
                                            <span>برجاء إضافة الصورة </span>
                                            <span>(الصورة الأمامية لرخصة القيادة)</span>
                                        </div>
                                    </div>
                                    <div className='col-xl-6 col-lg-6 col-md-6 col-12'>
                                        <div className={style.car_images}>
                                            <input type='file' />
                                            <IconPhoto />
                                            <span>برجاء إضافة الصورة </span>
                                            <span>(الصورة الخلفية لرخصة القيادة)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-secondary" onClick={() => stepperRef.current.previous()}>رجوع</button>
                                <button className="btn btn-main-color" onClick={() => handleNext(2)}>التالي</button>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div id="step-3" className="content" role="tabpanel">
                            <b><IconGavel stroke={1} size={20} className='main-color'/> بيانات المزاد</b>
                            <p>برجاء إدخال بيانات المزاد للمتابعة.</p>
                            <div className='mb-3'>
                                <label className='mb-2'>تقرير السيارة</label>
                                <div className={style.car_images}>
                                    <input type='file' />
                                    <span>ارفاق التقرير PDF </span>
                                </div>
                                <label className='mb-2'>اقل سعر للمزايدة</label>
                                <input className='form-control mb-2' placeholder='مثال : 5000'/>
                                <label className='mb-2'>اللون</label>
                                <input className='form-control mb-2' placeholder='مثال : ازرق'/>
                                <label className='mb-2'>الرخصة</label>
                                <input className='form-control mb-2' placeholder='مثال: 2029'/>
                                <label className='mb-2'>الكيلومتر</label>
                                <input className='form-control mb-2' placeholder='مثال : 180'/>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-secondary" onClick={() => stepperRef.current.previous()}>رجوع</button>
                                <button className="btn btn-success" onClick={() => alert('تم تأكيد المزاد!')}>تأكيد</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAd;