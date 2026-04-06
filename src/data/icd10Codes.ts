import type { TestJustification } from '@/types/medication.types';

export const ICD10_TEST_JUSTIFICATIONS: Record<string, TestJustification> = {
  full_thyroid_panel: {
    test_name: 'Full Thyroid Panel (TSH, Free T3, Free T4, Reverse T3, TPO Antibodies)',
    codes: [
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'L65.9', description: 'Nonscarring hair loss, unspecified' },
      { code: 'E07.9', description: 'Disorder of thyroid, unspecified' },
    ],
    medical_necessity:
      'TSH alone is insufficient for comprehensive thyroid evaluation. Free T3 and Free T4 assess peripheral conversion and bioavailable hormone levels. Reverse T3 identifies euthyroid sick syndrome and conversion disorders. TPO antibodies detect Hashimoto thyroiditis, which may present with normal TSH in early stages. A complete panel is warranted when clinical symptoms suggest thyroid dysfunction despite normal TSH, particularly in the setting of fatigue, alopecia, or inflammatory bowel disease which impairs thyroid hormone metabolism.',
    triggers: ['fatigue', 'hair_loss', 'ibd', 'weight_gain', 'cold_intolerance', 'brain_fog', 'depression'],
  },

  testosterone_panel: {
    test_name: 'Total Testosterone, Free Testosterone, SHBG, Estradiol (Male)',
    codes: [
      { code: 'E29.1', description: 'Testicular hypofunction' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'L65.9', description: 'Nonscarring hair loss, unspecified' },
      { code: 'R68.89', description: 'Other general symptoms and signs' },
    ],
    medical_necessity:
      'Total testosterone alone does not reflect bioavailable hormone levels. SHBG is required to interpret free testosterone accurately, as elevated SHBG in obesity, liver disease, or aging falsely normalizes total testosterone. Estradiol assessment is necessary to evaluate aromatase activity and estrogen-testosterone balance, which directly impacts symptom presentation in hypogonadal males. Comprehensive panel is indicated when symptoms of androgen deficiency are present including fatigue, hair loss, decreased libido, or sarcopenia.',
    triggers: ['fatigue', 'hair_loss', 'low_libido', 'muscle_loss', 'depression', 'obesity', 'metabolic_syndrome'],
  },

  fasting_insulin_homa: {
    test_name: 'Fasting Insulin + HOMA-IR Calculation',
    codes: [
      { code: 'E78.1', description: 'Pure hypertriglyceridemia' },
      { code: 'R73.09', description: 'Other abnormal glucose' },
      { code: 'E88.81', description: 'Metabolic syndrome' },
    ],
    medical_necessity:
      'Fasting glucose and HbA1c are late markers of metabolic dysfunction and fail to detect insulin resistance in its early reversible stages. Fasting insulin with HOMA-IR calculation identifies hyperinsulinemia and insulin resistance years before glucose dysregulation manifests. This testing is medically necessary in patients with hypertriglyceridemia, borderline glucose, central obesity, PCOS, or metabolic syndrome to guide early intervention and prevent progression to type 2 diabetes and cardiovascular disease.',
    triggers: ['high_triglycerides', 'borderline_glucose', 'obesity', 'metabolic_syndrome', 'pcos'],
  },

  rbc_folate_mma: {
    test_name: 'RBC Folate + Methylmalonic Acid',
    codes: [
      { code: 'K50.90', description: "Crohn's disease, unspecified, without complications" },
      { code: 'K51.90', description: 'Ulcerative colitis, unspecified, without complications' },
      { code: 'L65.9', description: 'Nonscarring hair loss, unspecified' },
      { code: 'D52.1', description: 'Drug-induced folate deficiency anemia' },
    ],
    medical_necessity:
      'Serum folate and B12 levels are unreliable markers of intracellular status. RBC folate reflects tissue folate stores over the preceding 120 days and is the appropriate test for patients on folate-depleting medications including mesalamine and methotrexate. Methylmalonic acid is the definitive functional marker for B12 deficiency, elevated before serum B12 declines. This combination is essential in IBD patients with malabsorption, patients on known depletive medications, and those presenting with fatigue or hair loss where functional deficiency must be excluded.',
    triggers: ['mesalamine', 'methotrexate', 'ibd', 'hair_loss', 'fatigue', 'metformin'],
  },

  ck_statin_myopathy: {
    test_name: 'Creatine Kinase (CK/CPK)',
    codes: [
      { code: 'M79.3', description: 'Panniculitis, unspecified' },
      { code: 'T46.6X5A', description: 'Adverse effect of antihyperlipidemic drugs, initial encounter' },
      { code: 'G72.0', description: 'Drug-induced myopathy' },
    ],
    medical_necessity:
      'Creatine kinase measurement is medically necessary for patients on HMG-CoA reductase inhibitors (statins) presenting with myalgia, muscle weakness, fatigue, or exercise intolerance to evaluate for statin-induced myopathy. Statins inhibit mitochondrial CoQ10 synthesis, which can result in subclinical or overt muscle damage. Baseline and serial CK levels are required to differentiate statin-related myotoxicity from other causes and to guide continuation, dose adjustment, or discontinuation of therapy. Early detection prevents progression to rhabdomyolysis.',
    triggers: ['statin_use', 'muscle_pain', 'fatigue', 'exercise_intolerance'],
  },

  apob_lpa: {
    test_name: 'ApoB + Lp(a)',
    codes: [
      { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
      { code: 'E78.01', description: 'Familial hypercholesterolemia' },
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
    ],
    medical_necessity:
      'Standard lipid panels using LDL-C calculated by the Friedewald equation are unreliable in patients with elevated triglycerides, metabolic syndrome, or discordant lipid phenotypes. ApoB directly quantifies the number of atherogenic lipoprotein particles and is superior to LDL-C for cardiovascular risk stratification. Lp(a) is a genetically determined, independent cardiovascular risk factor that is not measured on standard panels and cannot be reduced by lifestyle modification alone. Testing is indicated in patients with hypercholesterolemia, family history of premature cardiovascular disease, or suspected familial hypercholesterolemia to guide targeted therapy.',
    triggers: ['high_cholesterol', 'family_history_heart_disease', 'cardiovascular_risk', 'fh_suspected'],
  },

  fh_genetic_panel: {
    test_name: 'Familial Hypercholesterolemia Genetic Panel (LDLR, APOB, PCSK9)',
    codes: [
      { code: 'E78.01', description: 'Familial hypercholesterolemia' },
      { code: 'Z84.89', description: 'Family history of other specified conditions' },
    ],
    medical_necessity:
      'Genetic testing for familial hypercholesterolemia is indicated in patients with severely elevated LDL-C, particularly with young-onset hypercholesterolemia or strong family history of premature cardiovascular events. Identification of pathogenic variants in LDLR, APOB, or PCSK9 genes confirms the diagnosis, enables cascade family screening, qualifies patients for PCSK9 inhibitor therapy coverage, and informs prognosis. Statin intolerance in the setting of suspected FH further supports genetic evaluation to guide alternative therapeutic strategies including PCSK9 inhibitors and bempedoic acid.',
    triggers: ['high_cholesterol_young_onset', 'family_history_heart_disease', 'statin_intolerance'],
  },

  hs_crp: {
    test_name: 'High Sensitivity CRP (hs-CRP)',
    codes: [
      { code: 'K50.90', description: "Crohn's disease, unspecified, without complications" },
      { code: 'K51.90', description: 'Ulcerative colitis, unspecified, without complications' },
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
      { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
    ],
    medical_necessity:
      'High-sensitivity CRP quantifies low-grade systemic inflammation and is an established independent predictor of cardiovascular events per AHA/ACC guidelines. In IBD patients, hs-CRP serves as a noninvasive marker of disease activity and subclinical flare. In metabolic syndrome and hypercholesterolemia, elevated hs-CRP identifies residual inflammatory cardiovascular risk that persists despite lipid-lowering therapy. Serial monitoring guides anti-inflammatory interventions and risk-stratifies patients for intensified preventive therapy.',
    triggers: ['ibd', 'cardiovascular_risk', 'metabolic_syndrome', 'autoimmune'],
  },

  hla_b27: {
    test_name: 'HLA-B27',
    codes: [
      { code: 'M45.9', description: 'Ankylosing spondylitis of unspecified sites in spine' },
      { code: 'K50.90', description: "Crohn's disease, unspecified, without complications" },
      { code: 'K51.90', description: 'Ulcerative colitis, unspecified, without complications' },
      { code: 'M07.60', description: 'Enteropathic arthropathies, unspecified site' },
    ],
    medical_necessity:
      'HLA-B27 testing is medically necessary in IBD patients presenting with inflammatory back pain, peripheral joint involvement, or uveitis to evaluate for ankylosing spondylitis and enteropathic arthropathy. IBD patients carry a significantly elevated prevalence of HLA-B27 positivity and spondyloarthropathy. Early identification enables initiation of appropriate biologic therapy that may treat both intestinal and extraintestinal manifestations, prevents irreversible structural joint damage, and guides rheumatology referral.',
    triggers: ['ibd', 'joint_pain', 'back_pain', 'uveitis'],
  },

  vitamin_d: {
    test_name: 'Vitamin D (25-OH)',
    codes: [
      { code: 'K50.90', description: "Crohn's disease, unspecified, without complications" },
      { code: 'K51.90', description: 'Ulcerative colitis, unspecified, without complications' },
      { code: 'M83.9', description: 'Adult osteomalacia, unspecified' },
      { code: 'D86.9', description: 'Sarcoidosis, unspecified' },
    ],
    medical_necessity:
      'Vitamin D (25-hydroxyvitamin D) testing is indicated in patients with IBD due to high prevalence of deficiency from malabsorption, corticosteroid use, and limited sun exposure. Deficiency in IBD is associated with increased disease activity, mucosal inflammation, and risk of colorectal dysplasia. Patients on immunosuppressants require monitoring as vitamin D modulates immune function and bone metabolism. Testing is also warranted in patients with myalgia, fatigue, autoimmune conditions, or documented malabsorption to guide repletion and maintenance dosing.',
    triggers: ['ibd', 'immunosuppressant', 'muscle_pain', 'fatigue', 'autoimmune', 'malabsorption'],
  },

  mthfr: {
    test_name: 'MTHFR Gene Mutation Panel',
    codes: [
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
      { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
      { code: 'D52.9', description: 'Folate deficiency anemia, unspecified' },
    ],
    medical_necessity:
      'MTHFR polymorphism testing (C677T and A1298C variants) is indicated when clinical presentation suggests impaired methylation, including treatment-resistant depression, unexplained folate deficiency despite adequate dietary intake, elevated homocysteine, or cardiovascular disease with unclear etiology. MTHFR variants reduce enzymatic conversion of folic acid to L-methylfolate by up to 70% in compound heterozygotes, directly impacting neurotransmitter synthesis, DNA methylation, and homocysteine metabolism. Results guide supplementation form (methylfolate rather than folic acid) and are particularly relevant for patients on mesalamine or methotrexate.',
    triggers: ['depression', 'cardiovascular_risk', 'folate_deficiency', 'homocysteine_elevated', 'mesalamine', 'methotrexate'],
  },

  iron_panel_complete: {
    test_name: 'Complete Iron Panel (Serum Iron, TIBC, Transferrin Saturation, Ferritin)',
    codes: [
      { code: 'K50.90', description: "Crohn's disease, unspecified, without complications" },
      { code: 'K51.90', description: 'Ulcerative colitis, unspecified, without complications' },
      { code: 'D50.9', description: 'Iron deficiency anemia, unspecified' },
      { code: 'L65.9', description: 'Nonscarring hair loss, unspecified' },
    ],
    medical_necessity:
      'A complete iron panel is required rather than ferritin alone because ferritin is an acute phase reactant that may be falsely elevated in IBD and other inflammatory states, masking true iron deficiency. Serum iron, TIBC, and transferrin saturation together differentiate iron deficiency anemia from anemia of chronic disease and functional iron deficiency. IBD patients are at high risk for iron deficiency due to chronic intestinal blood loss, impaired absorption, and dietary restriction. Iron deficiency is also the most common reversible cause of telogen effluvium and must be comprehensively evaluated in patients with hair loss.',
    triggers: ['ibd', 'hair_loss', 'fatigue', 'pallor', 'restless_legs'],
  },

  comprehensive_stool: {
    test_name: 'Comprehensive Stool Analysis + Calprotectin',
    codes: [
      { code: 'K50.90', description: "Crohn's disease, unspecified, without complications" },
      { code: 'K51.90', description: 'Ulcerative colitis, unspecified, without complications' },
      { code: 'R19.7', description: 'Diarrhea, unspecified' },
    ],
    medical_necessity:
      'Fecal calprotectin is a validated noninvasive biomarker that correlates with endoscopic disease activity in IBD and differentiates inflammatory from functional bowel disorders without the need for colonoscopy. Comprehensive stool analysis identifies concurrent infections, dysbiosis, pancreatic exocrine insufficiency, and malabsorption that may complicate IBD management or mimic active disease. This testing reduces unnecessary endoscopic procedures while ensuring subclinical mucosal inflammation is detected and treated to prevent disease progression and complications.',
    triggers: ['ibd', 'bowel_symptoms', 'abdominal_pain', 'diarrhea'],
  },

  morning_cortisol_dheas: {
    test_name: 'Morning Cortisol + DHEA-S',
    codes: [
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'E27.49', description: 'Other adrenocortical insufficiency' },
    ],
    medical_necessity:
      'Morning cortisol (8 AM draw) and DHEA-S are indicated in patients with persistent fatigue, poor stress tolerance, and chronic illness to evaluate adrenal reserve and hypothalamic-pituitary-adrenal axis function. IBD patients and those with chronic autoimmune conditions are at risk for relative adrenal insufficiency, particularly with prior or current corticosteroid exposure. DHEA-S provides assessment of adrenal androgen production, which declines with chronic illness and stress, contributing to fatigue, immune dysregulation, and impaired recovery. Results guide adrenal support strategies and identify patients requiring endocrinology referral.',
    triggers: ['fatigue', 'low_stress_tolerance', 'ibd', 'chronic_illness', 'autoimmune'],
  },

  sleep_study: {
    test_name: 'Home Sleep Apnea Test',
    codes: [
      { code: 'G47.33', description: 'Obstructive sleep apnea' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'E66.9', description: 'Obesity, unspecified' },
    ],
    medical_necessity:
      'Home sleep apnea testing is indicated in patients with clinical features suggestive of obstructive sleep apnea including snoring, witnessed apneas, excessive daytime somnolence, and unrefreshing sleep, particularly in the context of obesity, metabolic syndrome, hypertension, or refractory hypertriglyceridemia. Untreated OSA independently worsens insulin resistance, cardiovascular risk, systemic inflammation, and IBD disease activity. Diagnosis enables CPAP or oral appliance therapy which has been shown to improve metabolic parameters, reduce cardiovascular events, and enhance quality of life. Screening is supported by AASM guidelines in high-risk populations.',
    triggers: ['snoring', 'fatigue', 'obesity', 'high_triglycerides', 'hypertension', 'metabolic_syndrome'],
  },

  // ── HORMONES ────────────────────────────────────────────────────────────
  estradiol_progesterone_female: {
    test_name: 'Estradiol, Progesterone, LH, FSH (Female Hormone Panel)',
    codes: [
      { code: 'N91.2', description: 'Amenorrhea, unspecified' },
      { code: 'N92.6', description: 'Irregular menstruation, unspecified' },
      { code: 'E28.9', description: 'Ovarian dysfunction, unspecified' },
      { code: 'N95.1', description: 'Menopausal and female climacteric states' },
      { code: 'R53.83', description: 'Other fatigue' },
    ],
    medical_necessity:
      'Comprehensive female hormone assessment including estradiol, progesterone, LH, and FSH is medically necessary in women presenting with menstrual irregularity, amenorrhea, infertility, perimenopausal symptoms, or unexplained fatigue. Isolated testing of individual hormones fails to capture the dynamic interplay of the hypothalamic-pituitary-ovarian axis. LH:FSH ratio is essential for PCOS evaluation, while estradiol and progesterone together assess ovulatory function and luteal phase adequacy. Testing guides hormone replacement therapy decisions and identifies premature ovarian insufficiency.',
    triggers: ['irregular_periods', 'amenorrhea', 'infertility', 'perimenopause', 'hot_flashes', 'fatigue', 'pcos'],
  },

  prolactin: {
    test_name: 'Prolactin Level',
    codes: [
      { code: 'E22.1', description: 'Hyperprolactinemia' },
      { code: 'N91.2', description: 'Amenorrhea, unspecified' },
      { code: 'N64.3', description: 'Galactorrhea not associated with childbirth' },
      { code: 'E29.1', description: 'Testicular hypofunction' },
      { code: 'R53.83', description: 'Other fatigue' },
    ],
    medical_necessity:
      'Prolactin measurement is indicated in patients with galactorrhea, amenorrhea, oligomenorrhea, infertility, hypogonadism, or decreased libido. Hyperprolactinemia suppresses GnRH pulsatility, leading to secondary hypogonadism in both sexes. Elevated prolactin may indicate pituitary adenoma requiring imaging, or medication-induced elevation from antipsychotics, SSRIs, or dopamine antagonists. Testing is essential to differentiate primary hypogonadism from prolactin-mediated suppression, as treatment differs fundamentally between these etiologies.',
    triggers: ['amenorrhea', 'galactorrhea', 'infertility', 'low_libido', 'hypogonadism', 'antipsychotic_use'],
  },

  cortisol_4point: {
    test_name: '4-Point Cortisol (Saliva or Urine)',
    codes: [
      { code: 'E27.40', description: 'Unspecified adrenocortical insufficiency' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'G47.9', description: 'Sleep disorder, unspecified' },
      { code: 'E27.1', description: 'Primary adrenocortical insufficiency' },
    ],
    medical_necessity:
      'Single-point morning cortisol provides an incomplete assessment of HPA axis function. Diurnal cortisol mapping with four collection points (morning, noon, evening, night) is necessary to identify cortisol rhythm dysregulation including blunted morning response, elevated nighttime cortisol, and flat diurnal curves. These patterns correlate with chronic fatigue, insomnia, anxiety, metabolic dysfunction, and immune suppression. Four-point testing is indicated in patients with treatment-resistant fatigue, sleep-wake disturbances, chronic stress, or suspected adrenal dysfunction to guide targeted circadian and adrenal interventions.',
    triggers: ['fatigue', 'insomnia', 'anxiety', 'chronic_stress', 'low_stress_tolerance', 'weight_gain'],
  },

  igf1_gh: {
    test_name: 'IGF-1 / Growth Hormone',
    codes: [
      { code: 'E23.0', description: 'Hypopituitarism' },
      { code: 'R62.52', description: 'Short stature (child)' },
      { code: 'E22.0', description: 'Acromegaly and pituitary gigantism' },
      { code: 'R53.83', description: 'Other fatigue' },
    ],
    medical_necessity:
      'IGF-1 serves as the primary screening marker for growth hormone status, as GH itself is pulsatile and unreliable on single measurement. IGF-1 testing is indicated in adults with suspected growth hormone deficiency presenting with increased visceral adiposity, decreased lean mass, fatigue, reduced bone density, or dyslipidemia. In the context of pituitary pathology, traumatic brain injury, or radiation exposure, IGF-1 assessment guides the need for provocative GH stimulation testing. Monitoring IGF-1 is also essential in patients on growth hormone replacement to ensure therapeutic and safe dosing.',
    triggers: ['fatigue', 'muscle_loss', 'increased_body_fat', 'low_bone_density', 'pituitary_disease'],
  },

  sex_hormone_panel_male: {
    test_name: 'Testosterone, Free T, SHBG, Estradiol, DHT (Male)',
    codes: [
      { code: 'E29.1', description: 'Testicular hypofunction' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'L65.9', description: 'Nonscarring hair loss, unspecified' },
      { code: 'N52.9', description: 'Male erectile dysfunction, unspecified' },
      { code: 'E88.81', description: 'Metabolic syndrome' },
    ],
    medical_necessity:
      'Comprehensive male hormone evaluation including total testosterone, free testosterone, SHBG, estradiol, and DHT is required for accurate assessment of androgen status. Total testosterone alone is insufficient as SHBG fluctuations in obesity, hepatic disease, and aging alter bioavailability. DHT assessment identifies 5-alpha reductase activity relevant to hair loss, prostate health, and androgenic symptoms. Estradiol quantifies aromatase-mediated conversion, which drives gynecomastia, mood changes, and metabolic dysfunction. This panel is indicated in males with fatigue, erectile dysfunction, hair loss, or metabolic syndrome.',
    triggers: ['fatigue', 'erectile_dysfunction', 'hair_loss', 'low_libido', 'gynecomastia', 'metabolic_syndrome', 'obesity'],
  },

  // ── CARDIOVASCULAR ──────────────────────────────────────────────────────
  lp_a: {
    test_name: 'Lipoprotein(a)',
    codes: [
      { code: 'E78.41', description: 'Elevated Lipoprotein(a)' },
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
      { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
      { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris' },
    ],
    medical_necessity:
      'Lipoprotein(a) is a genetically determined, independent causal risk factor for atherosclerotic cardiovascular disease and aortic valve stenosis that is not captured by standard lipid panels. Lp(a) levels are stable throughout life and need only be measured once. The 2018 AHA/ACC guidelines and European Atherosclerosis Society recommend Lp(a) measurement for cardiovascular risk refinement, particularly in patients with family history of premature ASCVD, familial hypercholesterolemia, or recurrent cardiovascular events despite statin therapy. Elevated Lp(a) guides intensification of risk factor modification and consideration of PCSK9 inhibitor therapy.',
    triggers: ['family_history_heart_disease', 'high_cholesterol', 'cardiovascular_risk', 'premature_cad', 'statin_intolerance'],
  },

  oxidized_ldl: {
    test_name: 'Oxidized LDL',
    codes: [
      { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
      { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
      { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris' },
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
    ],
    medical_necessity:
      'Oxidized LDL is a direct measure of atherogenic lipoprotein modification and a stronger predictor of coronary artery disease progression than native LDL-C. LDL particles become pathogenic only after oxidative modification, which triggers foam cell formation and plaque development. Standard LDL-C fails to distinguish between benign and oxidized particles. Testing is indicated in patients with hyperlipidemia, metabolic syndrome, or elevated cardiovascular risk to assess the degree of oxidative stress contributing to atherosclerosis and to guide antioxidant and anti-inflammatory interventions.',
    triggers: ['high_cholesterol', 'metabolic_syndrome', 'cardiovascular_risk', 'diabetes', 'chronic_inflammation'],
  },

  cardiac_calcium_score: {
    test_name: 'Coronary Artery Calcium Score',
    codes: [
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
      { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
      { code: 'E88.81', description: 'Metabolic syndrome' },
      { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris' },
    ],
    medical_necessity:
      'Coronary artery calcium scoring by CT is the most validated imaging biomarker for subclinical atherosclerosis and is recommended by AHA/ACC for intermediate-risk patients to reclassify cardiovascular risk. A CAC score of zero confers a 10-year event rate below 1%, while elevated scores identify patients who benefit from aggressive prevention. Testing is indicated in asymptomatic patients aged 40-75 with intermediate ASCVD risk, family history of premature CAD, metabolic syndrome, or discordant risk markers. CAC scoring directly informs shared decision-making regarding statin initiation and intensity of risk factor management.',
    triggers: ['cardiovascular_risk', 'family_history_heart_disease', 'metabolic_syndrome', 'intermediate_risk', 'statin_decision'],
  },

  carotid_imt: {
    test_name: 'Carotid Intima-Media Thickness',
    codes: [
      { code: 'I70.0', description: 'Atherosclerosis of aorta' },
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
      { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
      { code: 'I65.29', description: 'Occlusion and stenosis of unspecified carotid artery' },
    ],
    medical_necessity:
      'Carotid intima-media thickness measurement by B-mode ultrasound provides a noninvasive, radiation-free assessment of subclinical atherosclerosis and arterial wall remodeling. CIMT has been validated as an independent predictor of cardiovascular events and stroke. Testing is indicated in patients with traditional risk factors, family history of premature atherosclerosis, or metabolic syndrome where risk stratification by standard calculators is insufficient. Serial CIMT measurements can track atherosclerotic progression or regression in response to therapeutic interventions.',
    triggers: ['cardiovascular_risk', 'family_history_heart_disease', 'hypertension', 'hyperlipidemia', 'metabolic_syndrome'],
  },

  advanced_lipid_panel: {
    test_name: 'NMR LipoProfile / Advanced Lipid Panel',
    codes: [
      { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
      { code: 'E78.00', description: 'Pure hypercholesterolemia, unspecified' },
      { code: 'E88.81', description: 'Metabolic syndrome' },
      { code: 'E78.1', description: 'Pure hypertriglyceridemia' },
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
    ],
    medical_necessity:
      'NMR LipoProfile or ion mobility advanced lipid testing provides particle number and size data that standard lipid panels cannot assess. LDL particle number (LDL-P) is superior to LDL-C for cardiovascular risk prediction, particularly in patients with metabolic syndrome, diabetes, or discordant LDL-C/ApoB values. Small dense LDL particles are more atherogenic than large buoyant particles despite equivalent cholesterol content. Advanced testing identifies residual cardiovascular risk in statin-treated patients with at-goal LDL-C and guides intensification of therapy in high-risk populations.',
    triggers: ['high_cholesterol', 'metabolic_syndrome', 'diabetes', 'family_history_heart_disease', 'discordant_lipids', 'cardiovascular_risk'],
  },

  // ── METABOLIC ───────────────────────────────────────────────────────────
  homa_ir: {
    test_name: 'HOMA-IR Calculation (requires fasting insulin + glucose)',
    codes: [
      { code: 'E88.81', description: 'Metabolic syndrome' },
      { code: 'R73.09', description: 'Other abnormal glucose' },
      { code: 'E78.1', description: 'Pure hypertriglyceridemia' },
      { code: 'E66.01', description: 'Morbid (severe) obesity due to excess calories' },
    ],
    medical_necessity:
      'HOMA-IR (Homeostatic Model Assessment of Insulin Resistance) calculated from fasting insulin and glucose is the most accessible validated method for quantifying insulin resistance in clinical practice. Standard glucose and HbA1c become abnormal only after years of compensatory hyperinsulinemia have exhausted beta cell reserve. HOMA-IR identifies insulin resistance in its early reversible phase, enabling dietary, lifestyle, and pharmacologic intervention before irreversible metabolic damage occurs. Testing is indicated in patients with metabolic syndrome, obesity, hypertriglyceridemia, PCOS, or family history of type 2 diabetes.',
    triggers: ['obesity', 'metabolic_syndrome', 'high_triglycerides', 'pcos', 'family_history_diabetes', 'borderline_glucose'],
  },

  c_peptide: {
    test_name: 'C-Peptide',
    codes: [
      { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
      { code: 'R73.09', description: 'Other abnormal glucose' },
      { code: 'E13.9', description: 'Other specified diabetes mellitus without complications' },
      { code: 'E88.81', description: 'Metabolic syndrome' },
    ],
    medical_necessity:
      'C-peptide is cleaved from proinsulin in equimolar amounts and provides a reliable measure of endogenous insulin production that is unaffected by exogenous insulin administration or hepatic first-pass metabolism. Testing is medically necessary to differentiate type 1 from type 2 diabetes, assess residual beta cell function in established diabetics, evaluate hypoglycemia etiology, and monitor patients on insulin therapy. C-peptide also provides prognostic information regarding diabetes progression and guides therapeutic decisions including insulin initiation or transition to insulin secretagogues.',
    triggers: ['diabetes', 'hypoglycemia', 'insulin_resistance', 'diabetes_classification', 'borderline_glucose'],
  },

  hemoglobin_a1c: {
    test_name: 'Hemoglobin A1c',
    codes: [
      { code: 'R73.09', description: 'Other abnormal glucose' },
      { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
      { code: 'E88.81', description: 'Metabolic syndrome' },
      { code: 'Z83.3', description: 'Family history of diabetes mellitus' },
    ],
    medical_necessity:
      'Hemoglobin A1c reflects average glycemic control over the preceding 90-120 days and is the standard diagnostic and monitoring test for diabetes and prediabetes per ADA guidelines. Unlike fasting glucose, HbA1c captures postprandial excursions and glycemic variability. Testing is indicated in patients with risk factors for diabetes including obesity, metabolic syndrome, family history, PCOS, or prior gestational diabetes. Serial monitoring every 3-6 months guides therapeutic adjustments in diabetic patients. HbA1c must be interpreted with caution in conditions affecting red blood cell turnover.',
    triggers: ['obesity', 'metabolic_syndrome', 'family_history_diabetes', 'borderline_glucose', 'diabetes', 'pcos'],
  },

  oral_glucose_tolerance: {
    test_name: 'Oral Glucose Tolerance Test (OGTT)',
    codes: [
      { code: 'R73.02', description: 'Impaired glucose tolerance (oral)' },
      { code: 'R73.09', description: 'Other abnormal glucose' },
      { code: 'O99.810', description: 'Abnormal glucose complicating pregnancy, unspecified trimester' },
      { code: 'Z83.3', description: 'Family history of diabetes mellitus' },
    ],
    medical_necessity:
      'The oral glucose tolerance test is the gold standard for diagnosing impaired glucose tolerance and gestational diabetes, detecting glycemic abnormalities missed by fasting glucose and HbA1c alone. OGTT reveals postprandial insulin dynamics and glucose disposal capacity, identifying patients with reactive hypoglycemia and early beta cell dysfunction. Testing is indicated when fasting glucose and HbA1c are discordant, in gestational diabetes screening, and in patients with strong risk factors for diabetes who have normal fasting labs but clinical suspicion of dysglycemia.',
    triggers: ['borderline_glucose', 'gestational_diabetes', 'pcos', 'reactive_hypoglycemia', 'family_history_diabetes'],
  },

  uric_acid: {
    test_name: 'Uric Acid',
    codes: [
      { code: 'E79.0', description: 'Hyperuricemia without signs of inflammatory arthritis and tophaceous disease' },
      { code: 'M10.9', description: 'Gout, unspecified' },
      { code: 'E88.81', description: 'Metabolic syndrome' },
      { code: 'N20.0', description: 'Calculus of kidney' },
    ],
    medical_necessity:
      'Uric acid measurement is medically necessary for evaluation of gout, nephrolithiasis, tumor lysis syndrome, and metabolic syndrome. Elevated uric acid is an independent risk factor for hypertension, cardiovascular disease, chronic kidney disease, and type 2 diabetes. Uric acid reflects fructose metabolism and purine turnover and serves as an early marker of metabolic dysfunction. Testing is indicated in patients with joint pain, kidney stones, metabolic syndrome, or elevated cardiovascular risk. Serial monitoring guides dietary intervention, allopurinol dosing, and assessment of metabolic improvement.',
    triggers: ['gout', 'joint_pain', 'kidney_stones', 'metabolic_syndrome', 'hypertension', 'cardiovascular_risk'],
  },

  // ── NUTRIENTS ───────────────────────────────────────────────────────────
  rbc_magnesium: {
    test_name: 'RBC Magnesium (not serum)',
    codes: [
      { code: 'E61.2', description: 'Magnesium deficiency' },
      { code: 'R25.2', description: 'Cramp and spasm' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'G47.00', description: 'Insomnia, unspecified' },
      { code: 'I49.9', description: 'Cardiac arrhythmia, unspecified' },
    ],
    medical_necessity:
      'RBC magnesium is the appropriate test for magnesium status assessment as serum magnesium reflects only 1% of total body stores and remains normal until severe depletion occurs. Intracellular RBC magnesium detects subclinical deficiency that serum testing misses. Magnesium deficiency is highly prevalent and contributes to muscle cramps, insomnia, anxiety, cardiac arrhythmias, migraines, and insulin resistance. Testing is indicated in patients on diuretics, proton pump inhibitors, or with diabetes, chronic fatigue, muscle spasms, or cardiovascular disease to guide repletion and prevent complications.',
    triggers: ['muscle_cramps', 'insomnia', 'anxiety', 'arrhythmia', 'migraines', 'diuretic_use', 'ppi_use', 'fatigue'],
  },

  zinc_serum: {
    test_name: 'Serum Zinc',
    codes: [
      { code: 'E60', description: 'Dietary zinc deficiency' },
      { code: 'L65.9', description: 'Nonscarring hair loss, unspecified' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'L73.9', description: 'Follicular disorder, unspecified' },
    ],
    medical_necessity:
      'Zinc is an essential cofactor for over 300 enzymatic reactions including immune function, wound healing, DNA synthesis, and hormone production. Deficiency causes alopecia, impaired immune response, hypogonadism, dermatitis, and impaired taste. Patients with IBD, chronic diarrhea, vegetarian diets, alcoholism, and malabsorptive conditions are at high risk. Testing is indicated in patients with unexplained hair loss, recurrent infections, poor wound healing, or conditions associated with zinc malabsorption. Results guide repletion strategies while avoiding copper antagonism from excessive supplementation.',
    triggers: ['hair_loss', 'poor_wound_healing', 'recurrent_infections', 'ibd', 'malabsorption', 'vegetarian_diet'],
  },

  copper_ceruloplasmin: {
    test_name: 'Copper and Ceruloplasmin',
    codes: [
      { code: 'E61.0', description: 'Copper deficiency' },
      { code: 'E83.01', description: "Wilson's disease" },
      { code: 'D64.9', description: 'Anemia, unspecified' },
      { code: 'G62.9', description: 'Polyneuropathy, unspecified' },
    ],
    medical_necessity:
      'Copper and ceruloplasmin testing is necessary to evaluate copper status in patients with unexplained anemia, neutropenia, or neuropathy that may indicate copper deficiency, particularly in patients on long-term zinc supplementation, post-bariatric surgery, or with malabsorptive conditions. Testing also screens for Wilson disease in patients with unexplained liver disease, neuropsychiatric symptoms, or Kayser-Fleischer rings. The copper-to-ceruloplasmin ratio provides assessment of free copper, which drives oxidative damage in Wilson disease. Accurate copper status assessment is essential before initiating zinc or copper supplementation.',
    triggers: ['anemia', 'neuropathy', 'zinc_supplementation', 'liver_disease', 'neuropsychiatric_symptoms', 'bariatric_surgery'],
  },

  omega3_index_test: {
    test_name: 'Omega-3 Index',
    codes: [
      { code: 'E63.8', description: 'Other specified nutritional deficiencies' },
      { code: 'E78.1', description: 'Pure hypertriglyceridemia' },
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
      { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    ],
    medical_necessity:
      'The Omega-3 Index measures EPA and DHA as a percentage of total red blood cell fatty acids and is a validated risk factor for cardiovascular mortality, sudden cardiac death, and cognitive decline. An index below 4% confers the highest cardiovascular risk, while levels above 8% are cardioprotective. Testing is indicated in patients with hypertriglyceridemia, cardiovascular risk, depression, inflammatory conditions, or cognitive concerns. Results guide precise omega-3 supplementation dosing and monitor therapeutic response, as individual absorption and incorporation vary significantly.',
    triggers: ['cardiovascular_risk', 'high_triglycerides', 'depression', 'cognitive_decline', 'inflammation', 'autoimmune'],
  },

  coq10_level: {
    test_name: 'CoQ10 / Ubiquinol Level',
    codes: [
      { code: 'E88.89', description: 'Other specified metabolic disorders' },
      { code: 'T46.6X5A', description: 'Adverse effect of antihyperlipidemic drugs, initial encounter' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'I50.9', description: 'Heart failure, unspecified' },
    ],
    medical_necessity:
      'Coenzyme Q10 (ubiquinol) is essential for mitochondrial electron transport chain function and cellular energy production. Statins inhibit the mevalonate pathway, reducing CoQ10 synthesis by up to 40%, contributing to statin-associated myopathy, fatigue, and exercise intolerance. CoQ10 deficiency also occurs in heart failure, aging, and mitochondrial disorders. Testing is indicated in patients on statin therapy with myalgia or fatigue, patients with heart failure, and those with unexplained exercise intolerance. Results guide supplementation dosing to restore mitochondrial function and alleviate statin-related symptoms.',
    triggers: ['statin_use', 'muscle_pain', 'fatigue', 'heart_failure', 'exercise_intolerance', 'aging'],
  },

  iodine_loading: {
    test_name: 'Iodine Loading Test (24-hour urine)',
    codes: [
      { code: 'E01.8', description: 'Other iodine-deficiency related thyroid disorders and allied conditions' },
      { code: 'E07.9', description: 'Disorder of thyroid, unspecified' },
      { code: 'E04.9', description: 'Nontoxic goiter, unspecified' },
    ],
    medical_necessity:
      'The iodine loading test assesses whole-body iodine sufficiency by measuring 24-hour urinary iodine excretion after a standardized oral iodine load. Spot urine iodine is unreliable due to significant diurnal and dietary variation. Iodine deficiency impairs thyroid hormone synthesis, contributes to goiter formation, and is more prevalent than commonly recognized, particularly in patients avoiding iodized salt, following restricted diets, or with fibrocystic breast disease. Testing is indicated in patients with hypothyroidism resistant to standard therapy, goiter, or clinical suspicion of iodine insufficiency.',
    triggers: ['hypothyroidism', 'goiter', 'thyroid_dysfunction', 'restricted_diet', 'fibrocystic_breast'],
  },

  // ── AUTOIMMUNE ──────────────────────────────────────────────────────────
  ana_panel: {
    test_name: 'ANA Panel with Reflex',
    codes: [
      { code: 'M32.9', description: 'Systemic lupus erythematosus, unspecified' },
      { code: 'M35.9', description: 'Systemic involvement of connective tissue, unspecified' },
      { code: 'M79.3', description: 'Panniculitis, unspecified' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'L93.0', description: 'Discoid lupus erythematosus' },
    ],
    medical_necessity:
      'ANA panel with reflex testing to specific antibodies (dsDNA, Smith, RNP, SSA, SSB, Scl-70, centromere, Jo-1) is indicated when systemic autoimmune disease is suspected based on multisystem symptoms including fatigue, arthralgia, rash, serositis, or Raynaud phenomenon. ANA positivity without reflex testing is nonspecific, as low-titer ANA occurs in up to 15% of healthy individuals. Reflex antibody patterns guide specific diagnosis: anti-dsDNA for lupus, anti-centromere for limited scleroderma, anti-SSA/SSB for Sjogren syndrome. Accurate serologic diagnosis directs appropriate immunomodulatory therapy and organ-specific monitoring.',
    triggers: ['joint_pain', 'fatigue', 'rash', 'raynaud', 'dry_eyes', 'dry_mouth', 'autoimmune'],
  },

  tpo_tgab_antibodies: {
    test_name: 'TPO and Thyroglobulin Antibodies',
    codes: [
      { code: 'E06.3', description: 'Autoimmune thyroiditis' },
      { code: 'E07.9', description: 'Disorder of thyroid, unspecified' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'L65.9', description: 'Nonscarring hair loss, unspecified' },
    ],
    medical_necessity:
      'TPO antibodies and thyroglobulin antibodies are the definitive markers for autoimmune thyroid disease (Hashimoto thyroiditis), which is the most common cause of hypothyroidism. Antibody testing detects autoimmune thyroid destruction years before TSH abnormalities manifest, enabling early intervention. Up to 20% of Hashimoto patients have elevated thyroglobulin antibodies with normal TPO, necessitating both markers. Testing is indicated in patients with subclinical hypothyroidism, goiter, thyroid nodules, family history of autoimmune thyroid disease, or other autoimmune conditions due to polyautoimmunity clustering.',
    triggers: ['thyroid_dysfunction', 'fatigue', 'hair_loss', 'goiter', 'autoimmune', 'family_history_thyroid'],
  },

  celiac_panel: {
    test_name: 'Celiac Disease Panel (tTG-IgA, DGP, Total IgA)',
    codes: [
      { code: 'K90.0', description: 'Celiac disease' },
      { code: 'R19.7', description: 'Diarrhea, unspecified' },
      { code: 'D50.9', description: 'Iron deficiency anemia, unspecified' },
      { code: 'E61.2', description: 'Magnesium deficiency' },
      { code: 'L65.9', description: 'Nonscarring hair loss, unspecified' },
    ],
    medical_necessity:
      'Comprehensive celiac screening including tissue transglutaminase IgA, deamidated gliadin peptide IgG, and total IgA is necessary for accurate diagnosis. Total IgA must be included because selective IgA deficiency occurs in 2-3% of celiac patients and causes false-negative tTG-IgA results. Celiac disease affects approximately 1% of the population, with the majority undiagnosed. Testing is indicated in patients with chronic diarrhea, iron deficiency anemia unresponsive to supplementation, unexplained nutrient deficiencies, osteoporosis, type 1 diabetes, or other autoimmune conditions where celiac prevalence is increased 5-10 fold.',
    triggers: ['diarrhea', 'iron_deficiency', 'nutrient_deficiency', 'autoimmune', 'type1_diabetes', 'osteoporosis', 'hair_loss'],
  },

  complement_c3_c4: {
    test_name: 'Complement C3 and C4',
    codes: [
      { code: 'M32.9', description: 'Systemic lupus erythematosus, unspecified' },
      { code: 'D84.1', description: 'Defects in the complement system' },
      { code: 'N05.9', description: 'Unspecified nephritic syndrome with unspecified morphologic changes' },
      { code: 'M35.9', description: 'Systemic involvement of connective tissue, unspecified' },
    ],
    medical_necessity:
      'Complement C3 and C4 levels are essential for evaluating complement consumption in autoimmune diseases, particularly systemic lupus erythematosus where low complement correlates with disease activity and renal involvement. C4 is consumed early in the classical pathway and serves as a sensitive marker of immune complex-mediated disease. Testing is indicated in patients with known or suspected lupus, glomerulonephritis, vasculitis, hereditary angioedema (C4 deficiency), or recurrent infections suggesting complement deficiency. Serial complement monitoring guides immunosuppressive therapy adjustments and identifies impending disease flares.',
    triggers: ['lupus', 'autoimmune', 'glomerulonephritis', 'vasculitis', 'angioedema', 'recurrent_infections'],
  },

  esr: {
    test_name: 'Erythrocyte Sedimentation Rate (ESR)',
    codes: [
      { code: 'R70.0', description: 'Elevated erythrocyte sedimentation rate' },
      { code: 'M79.3', description: 'Panniculitis, unspecified' },
      { code: 'M35.9', description: 'Systemic involvement of connective tissue, unspecified' },
      { code: 'M31.6', description: 'Other giant cell arteritis' },
    ],
    medical_necessity:
      'Erythrocyte sedimentation rate is a nonspecific but clinically valuable marker of systemic inflammation. ESR reflects fibrinogen-driven red blood cell aggregation and is essential for diagnosis and monitoring of temporal arteritis, polymyalgia rheumatica, and rheumatoid arthritis. Unlike CRP, ESR responds more slowly to inflammatory changes and provides complementary information about chronic inflammatory burden. Testing is indicated in patients with suspected inflammatory conditions, unexplained fever, weight loss, diffuse pain syndromes, or as an adjunct to CRP for comprehensive inflammatory assessment.',
    triggers: ['joint_pain', 'unexplained_fever', 'weight_loss', 'diffuse_pain', 'autoimmune', 'temporal_arteritis'],
  },

  rheumatoid_factor_anti_ccp: {
    test_name: 'Rheumatoid Factor and Anti-CCP',
    codes: [
      { code: 'M06.9', description: 'Rheumatoid arthritis, unspecified' },
      { code: 'M79.3', description: 'Panniculitis, unspecified' },
      { code: 'M25.50', description: 'Pain in unspecified joint' },
      { code: 'M05.79', description: 'Rheumatoid arthritis with rheumatoid factor of unspecified site without organ or systems involvement' },
    ],
    medical_necessity:
      'Rheumatoid factor and anti-cyclic citrullinated peptide (anti-CCP) antibodies are complementary serologic markers for rheumatoid arthritis. Anti-CCP has superior specificity (95-98%) compared to RF (60-80%) and can be positive years before clinical disease onset. RF alone is nonspecific, occurring in infections, other autoimmune diseases, and elderly populations. Combined testing maximizes diagnostic sensitivity and specificity. Anti-CCP positivity confers worse prognosis with more erosive disease, guiding early aggressive therapy. Testing is indicated in patients with inflammatory polyarthritis, morning stiffness, or synovitis to enable early diagnosis and prevent irreversible joint destruction.',
    triggers: ['joint_pain', 'morning_stiffness', 'joint_swelling', 'autoimmune', 'family_history_ra'],
  },

  // ── GUT ─────────────────────────────────────────────────────────────────
  food_sensitivity_igg: {
    test_name: 'Food Sensitivity Panel (IgG)',
    codes: [
      { code: 'K59.1', description: 'Functional diarrhea' },
      { code: 'R10.9', description: 'Unspecified abdominal pain' },
      { code: 'K52.29', description: 'Allergic and dietetic gastroenteritis and colitis' },
      { code: 'L20.9', description: 'Atopic dermatitis, unspecified' },
    ],
    medical_necessity:
      'IgG-mediated food sensitivity testing identifies delayed-type immune reactions to dietary antigens that manifest 24-72 hours after ingestion, unlike IgE-mediated immediate allergies. These delayed reactions contribute to chronic GI symptoms, migraines, eczema, fatigue, and joint pain through immune complex formation and complement activation. Testing is indicated in patients with unexplained GI symptoms despite negative standard workup, chronic inflammatory conditions, atopic dermatitis resistant to treatment, or symptoms suggestive of food triggers that elimination diets have failed to identify systematically.',
    triggers: ['bloating', 'diarrhea', 'abdominal_pain', 'eczema', 'migraines', 'chronic_fatigue', 'joint_pain'],
  },

  sibo_breath_test: {
    test_name: 'SIBO Breath Test (Lactulose or Glucose)',
    codes: [
      { code: 'K63.8', description: 'Other specified diseases of intestine' },
      { code: 'R14.0', description: 'Abdominal distension (gaseous)' },
      { code: 'R19.7', description: 'Diarrhea, unspecified' },
      { code: 'K90.9', description: 'Intestinal malabsorption, unspecified' },
    ],
    medical_necessity:
      'Lactulose or glucose breath testing for small intestinal bacterial overgrowth (SIBO) is indicated in patients with chronic bloating, distension, diarrhea, or constipation unresponsive to standard therapy, particularly when IBS-like symptoms coexist with nutrient malabsorption. SIBO is present in up to 78% of IBS patients and is a treatable cause of symptoms often dismissed as functional. Breath testing measures hydrogen and methane production by fermenting bacteria, with methane-predominant SIBO specifically associated with constipation. Diagnosis guides targeted antimicrobial therapy, prokinetic agents, and dietary modification.',
    triggers: ['bloating', 'diarrhea', 'constipation', 'ibs', 'malabsorption', 'abdominal_pain', 'nutrient_deficiency'],
  },

  h_pylori: {
    test_name: 'H. Pylori Testing (Stool Antigen or Breath)',
    codes: [
      { code: 'B96.81', description: 'Helicobacter pylori as the cause of diseases classified elsewhere' },
      { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding' },
      { code: 'K27.9', description: 'Peptic ulcer, site unspecified, unspecified as acute or chronic, without hemorrhage or perforation' },
      { code: 'D50.9', description: 'Iron deficiency anemia, unspecified' },
    ],
    medical_necessity:
      'H. pylori testing via stool antigen or urea breath test is indicated for patients with dyspepsia, gastritis, peptic ulcer disease, or unexplained iron deficiency anemia. H. pylori infects approximately 50% of the global population and is a WHO Class I carcinogen for gastric cancer. The infection impairs iron absorption, reduces acid production, and increases gastric cancer risk 6-fold. Noninvasive testing is preferred over serology, which cannot distinguish active from prior infection. Test-and-treat strategy is recommended by ACG guidelines for uninvestigated dyspepsia in patients under 60.',
    triggers: ['dyspepsia', 'gastritis', 'peptic_ulcer', 'iron_deficiency', 'abdominal_pain', 'acid_reflux'],
  },

  zonulin: {
    test_name: 'Zonulin (Intestinal Permeability Marker)',
    codes: [
      { code: 'K63.8', description: 'Other specified diseases of intestine' },
      { code: 'K90.9', description: 'Intestinal malabsorption, unspecified' },
      { code: 'K52.9', description: 'Noninfective gastroenteritis and colitis, unspecified' },
      { code: 'M35.9', description: 'Systemic involvement of connective tissue, unspecified' },
    ],
    medical_necessity:
      'Zonulin is the only known physiological modulator of intestinal tight junctions and serves as a biomarker for intestinal permeability (leaky gut). Elevated zonulin indicates compromised gut barrier integrity, which allows translocation of bacterial endotoxins and food antigens triggering systemic immune activation. Increased intestinal permeability is documented in celiac disease, type 1 diabetes, IBD, autoimmune conditions, and metabolic syndrome. Testing is indicated in patients with autoimmune disease, chronic inflammation, food sensitivities, or GI symptoms to guide gut barrier restoration interventions including dietary modification and targeted supplementation.',
    triggers: ['autoimmune', 'food_sensitivities', 'bloating', 'ibd', 'chronic_inflammation', 'metabolic_syndrome'],
  },

  // ── GENETIC ─────────────────────────────────────────────────────────────
  apoe_genotype: {
    test_name: 'ApoE Genotype',
    codes: [
      { code: 'Z13.89', description: 'Encounter for screening for other disorder' },
      { code: 'Z83.3', description: 'Family history of diabetes mellitus' },
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
      { code: 'G30.9', description: "Alzheimer's disease, unspecified" },
    ],
    medical_necessity:
      'ApoE genotyping identifies the three common alleles (E2, E3, E4) that significantly influence lipid metabolism and neurodegenerative risk. The E4 allele confers 3-15 fold increased risk of Alzheimer disease and is associated with elevated LDL and impaired amyloid clearance. The E2 allele predisposes to type III hyperlipoproteinemia. ApoE status determines optimal dietary fat composition, as E4 carriers respond differently to saturated fat and require more aggressive cardiovascular prevention. Testing is indicated in patients with family history of Alzheimer disease, dyslipidemia resistant to standard therapy, or cardiovascular disease for precision medicine-guided intervention.',
    triggers: ['family_history_alzheimers', 'cognitive_decline', 'dyslipidemia', 'cardiovascular_risk', 'family_history_heart_disease'],
  },

  mthfr_full: {
    test_name: 'MTHFR C677T and A1298C',
    codes: [
      { code: 'Z82.49', description: 'Family history of ischemic heart disease and diseases of the circulatory system' },
      { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
      { code: 'D52.9', description: 'Folate deficiency anemia, unspecified' },
      { code: 'N96', description: 'Recurrent pregnancy loss' },
      { code: 'E72.11', description: 'Homocystinuria' },
    ],
    medical_necessity:
      'MTHFR genotyping for both C677T and A1298C polymorphisms is indicated when clinical evidence suggests impaired methylation. C677T homozygosity reduces enzyme activity by 70%, while compound heterozygosity (C677T/A1298C) reduces activity by 50%. Impaired methylation leads to elevated homocysteine, reduced methylfolate synthesis, impaired neurotransmitter metabolism, and epigenetic disruption. Testing is indicated in patients with hyperhomocysteinemia, treatment-resistant depression, recurrent pregnancy loss, neural tube defect history, or cardiovascular disease without traditional risk factors. Results guide supplementation with methylfolate and methylcobalamin rather than synthetic folic acid.',
    triggers: ['depression', 'elevated_homocysteine', 'recurrent_miscarriage', 'cardiovascular_risk', 'folate_deficiency', 'neural_tube_defects'],
  },

  comt_gene: {
    test_name: 'COMT Gene Variants',
    codes: [
      { code: 'Z13.89', description: 'Encounter for screening for other disorder' },
      { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
      { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
      { code: 'G43.909', description: 'Migraine, unspecified, not intractable, without status migrainosus' },
    ],
    medical_necessity:
      'COMT (catechol-O-methyltransferase) gene variant testing identifies Val158Met polymorphisms that significantly alter catecholamine and estrogen metabolism. The Met/Met genotype reduces enzyme activity 3-4 fold, leading to elevated dopamine, norepinephrine, and catechol estrogens with implications for anxiety, pain sensitivity, and estrogen-related cancer risk. The Val/Val genotype rapidly clears catecholamines, predisposing to low dopamine states and reduced stress resilience. COMT status guides personalized supplementation with magnesium, SAMe, and methylation cofactors, and informs estrogen metabolism management in women with hormone-sensitive conditions.',
    triggers: ['anxiety', 'depression', 'pain_sensitivity', 'estrogen_dominance', 'migraines', 'insomnia'],
  },

  // ── TOXICOLOGY ──────────────────────────────────────────────────────────
  heavy_metals_panel: {
    test_name: 'Heavy Metals Panel (Lead, Mercury, Arsenic, Cadmium)',
    codes: [
      { code: 'T56.0X1A', description: 'Toxic effects of lead and its compounds, accidental, initial encounter' },
      { code: 'Z77.011', description: 'Contact with and (suspected) exposure to lead' },
      { code: 'Z77.098', description: 'Contact with and (suspected) exposure to other hazardous metals' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'G62.9', description: 'Polyneuropathy, unspecified' },
    ],
    medical_necessity:
      'Heavy metals panel measuring lead, mercury, arsenic, and cadmium is indicated in patients with unexplained neurological symptoms, chronic fatigue, cognitive impairment, neuropathy, nephropathy, or occupational/environmental exposure risk. Chronic low-level heavy metal exposure causes cumulative organ damage including nephrotoxicity, neurotoxicity, endocrine disruption, and carcinogenesis. Lead impairs heme synthesis and cognitive function at levels previously considered safe. Mercury disrupts selenium-dependent enzymes and thyroid function. Testing guides chelation therapy decisions and identifies environmental sources requiring remediation.',
    triggers: ['neuropathy', 'cognitive_decline', 'chronic_fatigue', 'kidney_dysfunction', 'occupational_exposure', 'environmental_exposure'],
  },

  mycotoxin_panel: {
    test_name: 'Mycotoxin (Mold) Urine Panel',
    codes: [
      { code: 'T64.81XA', description: 'Toxic effect of mycotoxin food contaminants, accidental, initial encounter' },
      { code: 'J67.9', description: 'Hypersensitivity pneumonitis due to unspecified organic dust' },
      { code: 'R53.83', description: 'Other fatigue' },
      { code: 'G93.32', description: 'Myalgic encephalomyelitis/chronic fatigue syndrome' },
    ],
    medical_necessity:
      'Urinary mycotoxin testing identifies exposure to toxic mold metabolites including ochratoxin A, aflatoxins, trichothecenes, gliotoxin, and citrinin. Chronic mycotoxin exposure causes multisystem illness including chronic fatigue, cognitive dysfunction, respiratory symptoms, immune suppression, and endocrine disruption. Testing is indicated in patients with unexplained chronic inflammatory response syndrome (CIRS), treatment-resistant fatigue, history of water-damaged building exposure, or multisystem symptoms without clear etiology. Results guide environmental remediation, binding agents (cholestyramine, activated charcoal), and glutathione support for mycotoxin clearance.',
    triggers: ['chronic_fatigue', 'mold_exposure', 'cognitive_dysfunction', 'respiratory_symptoms', 'unexplained_inflammation', 'cirs'],
  },

  // ── OTHER ───────────────────────────────────────────────────────────────
  vitamin_a_level: {
    test_name: 'Vitamin A (Retinol) Level',
    codes: [
      { code: 'E50.9', description: 'Vitamin A deficiency, unspecified' },
      { code: 'H53.60', description: 'Unspecified night blindness' },
      { code: 'L85.0', description: 'Acquired ichthyosis' },
      { code: 'K90.9', description: 'Intestinal malabsorption, unspecified' },
    ],
    medical_necessity:
      'Vitamin A (retinol) testing is indicated in patients with malabsorption syndromes including IBD, celiac disease, and post-bariatric surgery, as well as those with night vision impairment, dry skin, recurrent infections, or impaired wound healing. Vitamin A is essential for epithelial integrity, immune function, vision, and gene expression. Fat malabsorption significantly impairs vitamin A absorption. Both deficiency and toxicity cause significant morbidity, necessitating precise measurement to guide supplementation. Testing is also indicated in patients on long-term vitamin A supplementation to prevent hypervitaminosis A, which causes hepatotoxicity and teratogenicity.',
    triggers: ['malabsorption', 'ibd', 'night_blindness', 'dry_skin', 'recurrent_infections', 'bariatric_surgery'],
  },

  dexa_scan: {
    test_name: 'DEXA Bone Density Scan',
    codes: [
      { code: 'M81.0', description: 'Age-related osteoporosis without current pathological fracture' },
      { code: 'M85.80', description: 'Other specified disorders of bone density and structure, unspecified site' },
      { code: 'Z87.310', description: 'Personal history of (healed) osteoporosis fracture' },
      { code: 'M80.00XA', description: 'Age-related osteoporosis with current pathological fracture, unspecified site, initial encounter' },
    ],
    medical_necessity:
      'DEXA scanning is the gold standard for bone mineral density assessment and osteoporosis diagnosis. Testing is indicated in postmenopausal women, men over 50 with risk factors, patients on chronic corticosteroids, hypogonadal patients, and those with conditions causing secondary osteoporosis including IBD, celiac disease, hyperparathyroidism, and hyperthyroidism. DEXA provides T-scores for fracture risk stratification and guides pharmacologic intervention decisions. Serial DEXA monitoring every 1-2 years assesses response to osteoporosis treatment. Body composition analysis by DEXA also quantifies visceral fat and lean mass for metabolic risk assessment.',
    triggers: ['postmenopausal', 'corticosteroid_use', 'fracture_history', 'hypogonadism', 'ibd', 'celiac_disease', 'hyperparathyroidism'],
  },

  psa: {
    test_name: 'PSA (Prostate-Specific Antigen)',
    codes: [
      { code: 'N40.0', description: 'Benign prostatic hyperplasia without lower urinary tract symptoms' },
      { code: 'Z12.5', description: 'Encounter for screening for malignant neoplasm of prostate' },
      { code: 'R33.9', description: 'Retention of urine, unspecified' },
      { code: 'Z80.42', description: 'Family history of malignant neoplasm of prostate' },
    ],
    medical_necessity:
      'PSA testing is indicated for prostate cancer screening in men aged 50-70 (or 40+ with risk factors including African American descent or first-degree relative with prostate cancer) who have been informed of benefits and risks per AUA/ACS shared decision-making guidelines. PSA also monitors disease recurrence after prostatectomy or radiation, assesses BPH severity, and evaluates response to 5-alpha reductase inhibitor therapy. PSA velocity and density provide additional risk stratification beyond absolute values. Testing is medically necessary in men with lower urinary tract symptoms, abnormal digital rectal exam, or elevated prostate cancer risk.',
    triggers: ['urinary_symptoms', 'family_history_prostate_cancer', 'screening_male_50plus', 'bph', 'prostate_follow_up'],
  },

  cystatin_c: {
    test_name: 'Cystatin C (superior GFR marker)',
    codes: [
      { code: 'N18.9', description: 'Chronic kidney disease, unspecified' },
      { code: 'R94.4', description: 'Abnormal results of kidney function studies' },
      { code: 'E11.22', description: 'Type 2 diabetes mellitus with diabetic chronic kidney disease' },
      { code: 'I12.9', description: 'Hypertensive chronic kidney disease with stage 1 through stage 4 chronic kidney disease, or unspecified chronic kidney disease' },
    ],
    medical_necessity:
      'Cystatin C is a superior marker for glomerular filtration rate estimation that is not affected by muscle mass, diet, sex, or race, unlike creatinine-based eGFR. CKD-EPI equations incorporating cystatin C provide more accurate GFR estimation, particularly in patients with extremes of body composition, vegetarian diets, sarcopenia, or borderline creatinine-based eGFR. KDIGO guidelines recommend cystatin C-based confirmatory testing when creatinine eGFR is 45-90 mL/min. Testing is indicated in patients with diabetes, hypertension, cardiovascular disease, or any condition where accurate GFR determination impacts clinical decision-making including medication dosing.',
    triggers: ['kidney_disease', 'diabetes', 'hypertension', 'cardiovascular_risk', 'medication_dosing', 'sarcopenia'],
  },
};
