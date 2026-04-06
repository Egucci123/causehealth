import type { MedicationInfo } from '@/types/medication.types';

export const MEDICATION_DEPLETIONS: Record<string, MedicationInfo> = {
  atorvastatin: {
    generic_name: 'atorvastatin',
    brand_names: ['Lipitor'],
    depletes: [
      {
        nutrient: 'CoQ10',
        severity: 'critical',
        mechanism:
          'Statins inhibit HMG-CoA reductase, which is also required for endogenous CoQ10 synthesis. Atorvastatin can reduce circulating CoQ10 levels by up to 40%.',
        symptoms_of_depletion: [
          'Muscle pain and weakness',
          'Fatigue and exercise intolerance',
          'Brain fog',
          'Shortness of breath',
          'Elevated creatine kinase',
        ],
        recommended_supplement:
          'Ubiquinol 100-200mg daily (preferred over ubiquinone for better absorption)',
        evidence: 'strong',
      },
      {
        nutrient: 'Vitamin D',
        severity: 'moderate',
        mechanism:
          'Statins may interfere with cholesterol-dependent vitamin D synthesis pathways. Vitamin D is synthesized from 7-dehydrocholesterol, a cholesterol precursor affected by statin therapy.',
        symptoms_of_depletion: [
          'Bone pain',
          'Muscle weakness',
          'Increased fracture risk',
          'Depressed mood',
          'Impaired immune function',
        ],
        recommended_supplement:
          'Vitamin D3 2000-5000 IU daily, titrate based on serum 25(OH)D levels targeting 40-60 ng/mL',
        evidence: 'moderate',
      },
    ],
    liver_impact: 'moderate',
    liver_notes:
      'Atorvastatin is metabolized by CYP3A4 in the liver. Dose-dependent transaminase elevations occur in 1-3% of patients. Monitor liver enzymes at baseline and as clinically indicated.',
    alternatives: [
      'bempedoic_acid',
      'ezetimibe',
      'pcsk9_inhibitor',
      'rosuvastatin',
    ],
    muscle_pain_risk: 'high',
    monitoring_required: [
      'CK if muscle pain present',
      'liver enzymes',
      'lipid panel',
    ],
  },

  rosuvastatin: {
    generic_name: 'rosuvastatin',
    brand_names: ['Crestor'],
    depletes: [
      {
        nutrient: 'CoQ10',
        severity: 'moderate',
        mechanism:
          'Like all statins, rosuvastatin inhibits HMG-CoA reductase and reduces endogenous CoQ10 production. Effect may be somewhat less pronounced than with atorvastatin due to different pharmacokinetic profile.',
        symptoms_of_depletion: [
          'Muscle pain and weakness',
          'Fatigue',
          'Exercise intolerance',
          'Cognitive complaints',
        ],
        recommended_supplement:
          'Ubiquinol 100-200mg daily, especially if experiencing muscle symptoms',
        evidence: 'strong',
      },
    ],
    liver_impact: 'low_to_moderate',
    liver_notes:
      'Rosuvastatin is minimally metabolized by CYP2C9 and has less hepatic first-pass effect. Lower risk of liver enzyme elevation compared to atorvastatin.',
    muscle_pain_risk: 'lower_than_atorvastatin',
    notes:
      'Lower muscle pain risk than atorvastatin — preferred for statin-sensitive patients',
  },

  mesalamine: {
    generic_name: 'mesalamine',
    brand_names: ['Asacol', 'Delzicol', 'Pentasa', 'Lialda', 'Apriso'],
    depletes: [
      {
        nutrient: 'Folate',
        severity: 'critical',
        mechanism:
          'Mesalamine inhibits dihydrofolate reductase and competitively blocks folate absorption in the jejunum. Chronic intestinal inflammation from underlying IBD compounds this effect significantly.',
        symptoms_of_depletion: [
          'Megaloblastic anemia',
          'Fatigue and weakness',
          'Hair loss and thinning',
          'Mouth sores and glossitis',
          'Cognitive impairment',
          'Elevated homocysteine',
          'Neural tube defect risk if pregnant',
        ],
        recommended_supplement:
          'L-methylfolate (5-MTHF) 1-5mg daily, NOT folic acid — methylfolate bypasses MTHFR polymorphisms common in IBD patients',
        evidence: 'strong',
        important_note:
          'Use methylfolate (L-5-MTHF), not folic acid. Up to 40% of IBD patients have MTHFR polymorphisms that impair folic acid conversion. Methylfolate is the bioactive form and is directly usable by the body.',
      },
      {
        nutrient: 'B12',
        severity: 'high',
        mechanism:
          'Mesalamine can impair intrinsic factor binding and ileal B12 absorption. Patients with ileal disease or resection are at compounded risk. Long-term use progressively depletes hepatic B12 stores.',
        symptoms_of_depletion: [
          'Peripheral neuropathy and tingling',
          'Fatigue and weakness',
          'Cognitive decline and memory issues',
          'Glossitis',
          'Megaloblastic anemia',
          'Depression and mood changes',
          'Hair loss',
        ],
        recommended_supplement:
          'Methylcobalamin 1000-5000mcg sublingual daily, or B12 injections if levels below 300 pg/mL or if ileal disease present',
        evidence: 'strong',
      },
    ],
    liver_impact: 'moderate',
    liver_notes:
      'Rare but documented hepatotoxicity. Monitor liver enzymes periodically, especially in patients with pre-existing liver conditions or those on concurrent hepatotoxic medications.',
    monitoring_required: [
      'RBC folate',
      'methylmalonic acid',
      'B12',
      'liver enzymes',
      'CBC',
    ],
    hair_loss_connection: 'critical',
    hair_loss_notes:
      'Folate and B12 depletion from mesalamine is the primary reversible cause of hair loss in IBD patients on this medication. Correcting these deficiencies often restores hair growth within 3-6 months. Always check RBC folate and B12 before attributing hair loss to the disease itself.',
  },

  metformin: {
    generic_name: 'metformin',
    brand_names: ['Glucophage', 'Glumetza'],
    depletes: [
      {
        nutrient: 'B12',
        severity: 'critical',
        mechanism:
          'Metformin interferes with calcium-dependent ileal absorption of the intrinsic factor-B12 complex. This is a dose-dependent and duration-dependent effect that worsens over time. Metformin also alters gut microbiome composition, further reducing B12 bioavailability.',
        symptoms_of_depletion: [
          'Peripheral neuropathy (often misdiagnosed as diabetic neuropathy)',
          'Fatigue and weakness',
          'Cognitive impairment and memory loss',
          'Macrocytic anemia',
          'Depression',
          'Glossitis',
          'Balance problems',
        ],
        recommended_supplement:
          'Methylcobalamin 1000-2000mcg sublingual daily. Consider B12 injections if serum B12 < 300 pg/mL or if neuropathy present.',
        evidence: 'strong',
        important_note:
          'Up to 30% of long-term metformin users develop B12 deficiency. Neuropathy from B12 deficiency is frequently misattributed to diabetic neuropathy — always check B12 and methylmalonic acid levels before assuming diabetic etiology.',
      },
      {
        nutrient: 'Folate',
        severity: 'moderate',
        mechanism:
          'Metformin may impair folate absorption through similar mechanisms affecting intestinal transport. Combined B12 and folate depletion elevates homocysteine, increasing cardiovascular risk in an already at-risk population.',
        symptoms_of_depletion: [
          'Elevated homocysteine',
          'Fatigue',
          'Megaloblastic anemia',
          'Cognitive changes',
          'Mood disturbances',
        ],
        recommended_supplement:
          'L-methylfolate 800mcg-1mg daily, especially if homocysteine is elevated',
        evidence: 'moderate',
      },
    ],
    monitoring_required: [
      'B12 annually minimum',
      'methylmalonic acid',
      'folate',
    ],
  },

  omeprazole: {
    generic_name: 'omeprazole',
    brand_names: ['Prilosec', 'Nexium (esomeprazole)'],
    depletes: [
      {
        nutrient: 'B12',
        severity: 'critical',
        mechanism:
          'Proton pump inhibitors drastically reduce stomach acid, which is required to cleave B12 from food proteins. Without adequate acid, pepsin cannot liberate protein-bound B12 for absorption. Risk increases significantly after 2+ years of use.',
        symptoms_of_depletion: [
          'Peripheral neuropathy',
          'Fatigue and weakness',
          'Cognitive decline',
          'Macrocytic anemia',
          'Depression',
          'Glossitis and mouth sores',
        ],
        recommended_supplement:
          'Methylcobalamin 1000-2000mcg sublingual daily (sublingual bypasses the acid-dependent absorption pathway)',
        evidence: 'strong',
      },
      {
        nutrient: 'Magnesium',
        severity: 'critical',
        mechanism:
          'PPIs impair both active and passive intestinal magnesium absorption by affecting TRPM6/TRPM7 ion channels in the gut. Hypomagnesemia can be severe and refractory to oral supplementation in some patients.',
        symptoms_of_depletion: [
          'Muscle cramps and spasms',
          'Cardiac arrhythmias',
          'Tremor',
          'Seizures in severe cases',
          'Fatigue',
          'Anxiety and irritability',
          'Insomnia',
        ],
        recommended_supplement:
          'Magnesium glycinate 200-400mg daily (glycinate form has best GI tolerance and absorption)',
        evidence: 'strong',
        fda_warning: true,
        fda_warning_text:
          'FDA safety communication (2011): Long-term PPI use may cause low serum magnesium levels (hypomagnesemia). Healthcare professionals should consider obtaining serum magnesium levels prior to initiation of PPI treatment and periodically thereafter.',
      },
      {
        nutrient: 'Zinc',
        severity: 'moderate',
        mechanism:
          'Reduced stomach acid impairs zinc solubility and absorption. Zinc requires an acidic environment for optimal ionization and uptake in the duodenum.',
        symptoms_of_depletion: [
          'Impaired immune function',
          'Slow wound healing',
          'Hair loss',
          'Taste changes',
          'Skin issues',
        ],
        recommended_supplement:
          'Zinc picolinate or zinc carnosine 15-30mg daily, taken away from other minerals',
        evidence: 'moderate',
      },
      {
        nutrient: 'Iron',
        severity: 'moderate',
        mechanism:
          'Gastric acid is essential for converting ferric iron (Fe3+) to the absorbable ferrous form (Fe2+). PPI-induced hypochlorhydria reduces non-heme iron absorption significantly.',
        symptoms_of_depletion: [
          'Fatigue and weakness',
          'Pale skin',
          'Shortness of breath',
          'Restless legs',
          'Brittle nails',
          'Cold intolerance',
        ],
        recommended_supplement:
          'Iron bisglycinate 25-50mg every other day with vitamin C to enhance absorption. Take 2 hours apart from PPI.',
        evidence: 'moderate',
      },
    ],
    liver_impact: 'low',
    liver_notes:
      'Omeprazole is metabolized by CYP2C19 and CYP3A4. Rarely causes hepatotoxicity but can interact with medications sharing these metabolic pathways.',
    notes:
      'PPIs cause multiple overlapping nutrient deficiencies that compound over time. The combination of B12, magnesium, zinc, and iron depletion creates a cascade of symptoms including fatigue, neuropathy, muscle cramps, immune dysfunction, and anemia. Deprescribing should be considered for long-term users when clinically appropriate.',
  },

  ustekinumab: {
    generic_name: 'ustekinumab',
    brand_names: ['Stelara'],
    depletes: [],
    liver_impact: 'moderate_to_high',
    liver_notes:
      'Ustekinumab is a biologic immunosuppressant that can cause hepatotoxicity. Rare cases of clinically significant liver injury have been reported. Patients with pre-existing liver disease or viral hepatitis require close monitoring.',
    immunosuppressant: true,
    immunosuppressant_notes:
      'Ustekinumab targets IL-12 and IL-23. Immunosuppression increases risk of serious infections including tuberculosis reactivation, opportunistic infections, and certain malignancies. Patients should be screened for latent TB and hepatitis B before initiation.',
    monitoring_required: [
      'liver enzymes every 6 months',
      'CBC',
      'tuberculosis screening before starting',
      'hepatitis B screening',
    ],
    drug_interactions: [
      'live vaccines contraindicated',
      'other immunosuppressants increase infection risk',
    ],
  },

  methotrexate: {
    generic_name: 'methotrexate',
    brand_names: ['Trexall', 'Rasuvo'],
    depletes: [
      {
        nutrient: 'Folate',
        severity: 'critical',
        mechanism:
          'Methotrexate is a direct folate antagonist that inhibits dihydrofolate reductase (DHFR), blocking the conversion of dihydrofolate to tetrahydrofolate. This is its primary mechanism of action but also causes severe folate depletion in all tissues.',
        symptoms_of_depletion: [
          'Mouth sores and stomatitis',
          'Nausea and GI distress',
          'Pancytopenia and bone marrow suppression',
          'Fatigue',
          'Hair loss',
          'Liver toxicity',
          'Increased infection risk',
        ],
        recommended_supplement:
          'Folic acid 1mg daily (taken on non-methotrexate days) or leucovorin (folinic acid) as prescribed. Some practitioners prefer L-methylfolate 1-5mg daily.',
        evidence: 'strong',
        important_note:
          'Folate supplementation is considered mandatory with methotrexate therapy. It significantly reduces side effects (stomatitis, nausea, liver toxicity, cytopenias) without diminishing methotrexate efficacy for autoimmune conditions. Standard practice is folic acid 1mg daily except on methotrexate dosing day.',
      },
    ],
    liver_impact: 'high',
    liver_notes:
      'Methotrexate is directly hepatotoxic. Cumulative doses can cause hepatic fibrosis and cirrhosis. Liver enzymes must be monitored closely, and liver biopsy or FibroScan may be warranted at cumulative doses above 1.5g. Alcohol must be strictly avoided.',
    monitoring_required: [
      'liver enzymes monthly initially',
      'CBC',
      'creatinine',
      'chest xray baseline',
    ],
  },

  prednisone: {
    generic_name: 'prednisone',
    brand_names: ['Deltasone', 'Rayos'],
    depletes: [
      {
        nutrient: 'Calcium',
        severity: 'critical',
        mechanism:
          'Corticosteroids reduce intestinal calcium absorption, increase renal calcium excretion, and directly inhibit osteoblast function. This creates a profoundly negative calcium balance leading to rapid bone loss, particularly in the first 6-12 months of therapy.',
        symptoms_of_depletion: [
          'Accelerated bone loss and osteoporosis',
          'Increased fracture risk',
          'Muscle cramps',
          'Dental problems',
          'Numbness and tingling',
        ],
        recommended_supplement:
          'Calcium citrate 500-600mg twice daily (citrate form preferred for better absorption, especially in patients on PPIs). Total dietary + supplemental calcium should reach 1200mg/day.',
        evidence: 'strong',
      },
      {
        nutrient: 'Vitamin D',
        severity: 'critical',
        mechanism:
          'Corticosteroids accelerate hepatic vitamin D catabolism, reduce vitamin D receptor expression, and antagonize vitamin D-mediated intestinal calcium transport. This creates functional vitamin D resistance even when serum levels appear adequate.',
        symptoms_of_depletion: [
          'Worsened bone loss beyond calcium depletion alone',
          'Muscle weakness and falls risk',
          'Immune dysfunction',
          'Mood disturbances',
          'Fatigue',
        ],
        recommended_supplement:
          'Vitamin D3 2000-4000 IU daily minimum, titrate based on serum levels. Many patients on chronic steroids require 4000-5000 IU daily to maintain adequate levels.',
        evidence: 'strong',
      },
      {
        nutrient: 'Magnesium',
        severity: 'high',
        mechanism:
          'Corticosteroids increase renal magnesium wasting. Hypomagnesemia further impairs calcium metabolism and bone health, creating a vicious cycle of mineral depletion.',
        symptoms_of_depletion: [
          'Muscle cramps and spasms',
          'Insomnia',
          'Anxiety and irritability',
          'Heart palpitations',
          'Fatigue',
          'Worsened bone loss',
        ],
        recommended_supplement:
          'Magnesium glycinate 200-400mg daily, taken at bedtime for sleep support',
        evidence: 'moderate',
      },
      {
        nutrient: 'Zinc',
        severity: 'moderate',
        mechanism:
          'Corticosteroids increase urinary zinc excretion and impair zinc-dependent immune functions. This is particularly relevant as zinc is critical for wound healing and immune competence, both already compromised by steroid therapy.',
        symptoms_of_depletion: [
          'Impaired wound healing',
          'Frequent infections',
          'Taste changes',
          'Skin thinning (compounded by steroid effects)',
          'Hair changes',
        ],
        recommended_supplement:
          'Zinc picolinate 15-30mg daily with food, balanced with 1-2mg copper if taking long term',
        evidence: 'moderate',
      },
      {
        nutrient: 'Potassium',
        severity: 'high',
        mechanism:
          'Corticosteroids have mineralocorticoid activity that promotes renal potassium excretion while retaining sodium. Higher doses and longer durations increase hypokalemia risk substantially.',
        symptoms_of_depletion: [
          'Muscle weakness and cramps',
          'Cardiac arrhythmias',
          'Fatigue',
          'Constipation',
          'Glucose intolerance (worsened)',
        ],
        recommended_supplement:
          'Increase dietary potassium through foods (bananas, potatoes, avocados, leafy greens). Potassium supplements only under medical supervision to avoid hyperkalemia.',
        evidence: 'strong',
        important_note:
          'Dietary potassium increase is preferred over supplementation. If supplementation is needed, it must be monitored with regular electrolyte panels to avoid dangerous hyperkalemia.',
      },
    ],
    bone_loss_risk: 'critical',
    bone_loss_notes:
      'Glucocorticoid-induced osteoporosis is the most common form of secondary osteoporosis. Bone loss is most rapid in the first 6-12 months and occurs at any dose, though risk increases with doses above 7.5mg/day prednisone equivalent. DEXA scan recommended at baseline for courses expected to exceed 3 months. Bisphosphonate therapy may be warranted.',
    blood_sugar_impact: 'high',
    blood_sugar_notes:
      'Prednisone causes dose-dependent hyperglycemia by increasing hepatic gluconeogenesis, reducing peripheral glucose uptake, and inducing insulin resistance. Blood glucose monitoring is essential, especially in diabetic or pre-diabetic patients. May unmask latent diabetes.',
  },

  oral_contraceptive: {
    generic_name: 'combined oral contraceptive',
    brand_names: ['Various'],
    depletes: [
      {
        nutrient: 'B6',
        severity: 'high',
        mechanism:
          'Oral contraceptives increase tryptophan metabolism via the kynurenine pathway, which consumes pyridoxal phosphate (active B6). Estrogen also induces hepatic enzymes that increase B6 catabolism.',
        symptoms_of_depletion: [
          'Depression and mood changes',
          'Anxiety',
          'Irritability',
          'Insomnia',
          'Fatigue',
          'Carpal tunnel-like symptoms',
          'Nausea (often attributed to the pill itself)',
        ],
        recommended_supplement:
          'Pyridoxal-5-phosphate (P5P) 25-50mg daily — the active form of B6 is preferred',
        evidence: 'strong',
      },
      {
        nutrient: 'B12',
        severity: 'moderate',
        mechanism:
          'Oral contraceptives reduce serum B12 levels, potentially through altered binding protein levels and reduced intestinal absorption. The clinical significance increases with duration of use.',
        symptoms_of_depletion: [
          'Fatigue',
          'Cognitive changes',
          'Mood disturbances',
          'Numbness or tingling',
        ],
        recommended_supplement:
          'Methylcobalamin 500-1000mcg sublingual daily',
        evidence: 'moderate',
      },
      {
        nutrient: 'Folate',
        severity: 'high',
        mechanism:
          'Estrogen-containing contraceptives impair folate absorption and increase folate catabolism. This is critically important because women may become pregnant shortly after discontinuing the pill, and folate status is essential for preventing neural tube defects.',
        symptoms_of_depletion: [
          'Elevated homocysteine',
          'Fatigue',
          'Cervical dysplasia risk',
          'Anemia',
          'Neural tube defect risk upon discontinuation and pregnancy',
        ],
        recommended_supplement:
          'L-methylfolate 400-800mcg daily. Critical to build folate stores before discontinuing for pregnancy planning.',
        evidence: 'strong',
      },
      {
        nutrient: 'Zinc',
        severity: 'moderate',
        mechanism:
          'Oral contraceptives shift zinc distribution, lowering serum levels while increasing hepatic copper. The resulting copper-zinc imbalance may contribute to mood changes and immune effects.',
        symptoms_of_depletion: [
          'Impaired immune function',
          'Skin issues and acne (often attributed to hormones alone)',
          'Taste changes',
          'Slow wound healing',
        ],
        recommended_supplement:
          'Zinc picolinate 15mg daily, may help with skin issues attributed to hormonal changes',
        evidence: 'moderate',
      },
      {
        nutrient: 'Magnesium',
        severity: 'moderate',
        mechanism:
          'Oral contraceptives increase renal magnesium excretion. Low magnesium may contribute to headaches, mood changes, and menstrual-like cramping that women experience on the pill.',
        symptoms_of_depletion: [
          'Headaches and migraines',
          'Muscle cramps',
          'Anxiety and mood swings',
          'Insomnia',
          'Water retention',
        ],
        recommended_supplement:
          'Magnesium glycinate 200-300mg daily, taken in the evening',
        evidence: 'moderate',
      },
      {
        nutrient: 'CoQ10',
        severity: 'low',
        mechanism:
          'Some evidence suggests oral contraceptives may modestly reduce CoQ10 levels, possibly through effects on mitochondrial metabolism. Data is limited but emerging.',
        symptoms_of_depletion: [
          'Fatigue',
          'Low energy',
        ],
        recommended_supplement:
          'Ubiquinol 50-100mg daily if fatigue is a concern',
        evidence: 'emerging',
      },
    ],
    notes:
      'The nutrient depletions caused by oral contraceptives explain many common side effects attributed solely to hormonal changes — including depression, fatigue, headaches, and mood swings. A quality B-complex with methylated forms plus magnesium addresses the majority of these depletions. Particularly important to optimize folate status before discontinuing for pregnancy.',
  },

  diuretic_thiazide: {
    generic_name: 'hydrochlorothiazide',
    brand_names: ['HCTZ', 'Microzide'],
    depletes: [
      {
        nutrient: 'Potassium',
        severity: 'critical',
        mechanism:
          'Thiazide diuretics increase sodium delivery to the distal nephron, where the Na+/K+ exchange pump excretes potassium in exchange for sodium reabsorption. This produces dose-dependent and often clinically significant hypokalemia.',
        symptoms_of_depletion: [
          'Muscle weakness and cramps',
          'Cardiac arrhythmias (potentially dangerous)',
          'Fatigue',
          'Constipation',
          'Polyuria and polydipsia',
          'Glucose intolerance',
        ],
        recommended_supplement:
          'Potassium chloride 20-40 mEq daily as prescribed, or increase dietary potassium. Often co-prescribed with potassium-sparing diuretic or ACE inhibitor.',
        evidence: 'strong',
      },
      {
        nutrient: 'Magnesium',
        severity: 'critical',
        mechanism:
          'Thiazides impair magnesium reabsorption in the distal convoluted tubule. Hypomagnesemia makes hypokalemia refractory to treatment — potassium cannot be corrected until magnesium is repleted.',
        symptoms_of_depletion: [
          'Muscle cramps and spasms',
          'Cardiac arrhythmias',
          'Tremor',
          'Refractory hypokalemia',
          'Fatigue',
          'Insomnia',
        ],
        recommended_supplement:
          'Magnesium glycinate or magnesium oxide 200-400mg daily. Must correct magnesium before potassium will normalize.',
        evidence: 'strong',
      },
      {
        nutrient: 'Zinc',
        severity: 'moderate',
        mechanism:
          'Thiazide diuretics increase urinary zinc excretion. Chronic use can lead to clinically relevant zinc depletion affecting immune function and wound healing.',
        symptoms_of_depletion: [
          'Impaired immune function',
          'Slow wound healing',
          'Taste disturbances',
          'Erectile dysfunction',
          'Skin changes',
        ],
        recommended_supplement:
          'Zinc picolinate 15-30mg daily with food, balance with 1-2mg copper if long-term',
        evidence: 'moderate',
      },
    ],
    monitoring_required: [
      'electrolytes every 3-6 months',
      'magnesium',
      'uric acid',
    ],
  },

  beta_blocker: {
    generic_name: 'metoprolol',
    brand_names: ['Lopressor', 'Toprol'],
    depletes: [
      {
        nutrient: 'CoQ10',
        severity: 'high',
        mechanism:
          'Beta-blockers inhibit CoQ10-dependent mitochondrial enzymes and may reduce endogenous CoQ10 synthesis. This is particularly significant because CoQ10 is essential for cardiac energy metabolism — the very organ these drugs are treating.',
        symptoms_of_depletion: [
          'Fatigue (often attributed to the beta-blocker itself)',
          'Exercise intolerance',
          'Worsening heart failure symptoms',
          'Muscle weakness',
          'Depression',
        ],
        recommended_supplement:
          'Ubiquinol 100-200mg daily. May help mitigate fatigue and exercise intolerance commonly attributed to beta-blocker side effects.',
        evidence: 'strong',
      },
    ],
  },

  ssri: {
    generic_name: 'ssri',
    brand_names: ['Prozac', 'Zoloft', 'Lexapro', 'Celexa', 'Paxil'],
    depletes: [
      {
        nutrient: 'Melatonin',
        severity: 'moderate',
        mechanism:
          'SSRIs alter serotonin metabolism which affects the serotonin-to-melatonin conversion pathway in the pineal gland. Serotonin is the direct precursor to melatonin via the enzyme AANAT, and SSRIs can disrupt this conversion by altering serotonin availability.',
        symptoms_of_depletion: [
          'Insomnia and sleep disturbances',
          'Disrupted circadian rhythm',
          'Daytime drowsiness',
          'Difficulty falling asleep',
          'Non-restorative sleep',
        ],
        recommended_supplement:
          'Melatonin 0.5-3mg 30-60 minutes before bedtime. Start with lowest effective dose.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Folate',
        severity: 'moderate',
        mechanism:
          'Adequate folate status is required for serotonin synthesis via the BH4 (tetrahydrobiopterin) pathway. Low folate impairs serotonin production and is strongly associated with SSRI non-response. Folate supplementation may enhance SSRI efficacy.',
        symptoms_of_depletion: [
          'Treatment-resistant depression',
          'Poor SSRI response',
          'Persistent fatigue despite treatment',
          'Elevated homocysteine',
          'Cognitive difficulties',
        ],
        recommended_supplement:
          'L-methylfolate 7.5-15mg daily as adjunct therapy. The prescription form Deplin (L-methylfolate 15mg) is FDA-approved as a medical food for depression.',
        evidence: 'strong',
        important_note:
          'L-methylfolate (the active form of folate) at 15mg/day has been shown in clinical trials to significantly improve SSRI response in treatment-resistant depression. The prescription product Deplin is specifically indicated for this purpose. OTC L-methylfolate at 7.5-15mg daily is a reasonable alternative.',
      },
    ],
  },

  warfarin: {
    generic_name: 'warfarin',
    brand_names: ['Coumadin', 'Jantoven'],
    depletes: [
      {
        nutrient: 'Vitamin K',
        severity: 'critical',
        mechanism:
          'Warfarin is a direct vitamin K antagonist — this is its mechanism of action. It inhibits vitamin K epoxide reductase (VKORC1), preventing recycling of vitamin K to its active form. While this is intentional for anticoagulation, it creates functional vitamin K deficiency affecting all vitamin K-dependent processes beyond clotting, including bone metabolism and vascular calcification.',
        symptoms_of_depletion: [
          'Increased bruising and bleeding (therapeutic effect)',
          'Accelerated bone loss and osteoporosis',
          'Vascular calcification',
          'Poor wound healing',
        ],
        recommended_supplement:
          'Do NOT supplement vitamin K without physician guidance. Consistent dietary vitamin K intake is essential — avoid major changes in vitamin K-rich food consumption. Some specialists use low-dose vitamin K (100mcg/day) to stabilize INR.',
        evidence: 'strong',
        medical_supervision_required: true,
        warning:
          'Vitamin K directly antagonizes warfarin. Any change in vitamin K intake (from supplements, dietary changes, or herbal products) will affect anticoagulation intensity and INR levels. This can lead to life-threatening bleeding or clotting events. All dietary and supplement changes must be discussed with the prescribing physician.',
      },
    ],
    monitoring_required: [
      'INR weekly to monthly',
      'avoid major dietary vitamin K changes',
    ],
    drug_interactions_extensive: true,
    notes:
      'Warfarin has one of the most extensive drug and food interaction profiles of any medication. Hundreds of substances can increase or decrease its effect. Patients must maintain consistent vitamin K intake and report all new medications, supplements, and significant dietary changes to their anticoagulation provider.',
  },

  lisinopril: {
    generic_name: 'lisinopril',
    brand_names: ['Zestril', 'Prinivil'],
    depletes: [
      {
        nutrient: 'Zinc',
        severity: 'moderate',
        mechanism:
          'ACE inhibitors chelate zinc due to their sulfhydryl group and increase urinary zinc excretion. Zinc depletion may contribute to the characteristic ACE inhibitor cough and taste disturbances.',
        symptoms_of_depletion: [
          'Impaired immune function',
          'Taste disturbances (metallic taste)',
          'Slow wound healing',
          'Dry cough (may worsen ACE inhibitor cough)',
          'Skin changes',
        ],
        recommended_supplement:
          'Zinc picolinate 15-30mg daily with food, balanced with 1-2mg copper if long-term',
        evidence: 'moderate',
      },
    ],
    notes:
      'ACE inhibitors can raise potassium levels — do not supplement potassium without medical supervision. Zinc depletion may contribute to the persistent cough commonly associated with ACE inhibitors.',
  },

  amlodipine: {
    generic_name: 'amlodipine',
    brand_names: ['Norvasc'],
    depletes: [],
    notes:
      'No major nutrient depletions documented. However, calcium channel blockers may interact with potassium metabolism. Monitor potassium if combined with other antihypertensives. Grapefruit juice can increase amlodipine levels via CYP3A4 inhibition.',
  },

  losartan: {
    generic_name: 'losartan',
    brand_names: ['Cozaar'],
    depletes: [],
    notes:
      'No major nutrient depletions documented for ARBs. Unlike ACE inhibitors, ARBs do not significantly affect zinc status. May raise potassium levels — avoid potassium supplementation without medical supervision.',
  },

  levothyroxine: {
    generic_name: 'levothyroxine',
    brand_names: ['Synthroid', 'Levoxyl'],
    depletes: [],
    notes:
      'Levothyroxine does not deplete nutrients, but its absorption is critically affected by calcium, iron, magnesium, and aluminum-containing antacids. These must be taken at least 4 hours apart from levothyroxine. Coffee, fiber, and soy can also impair absorption. Always take levothyroxine on an empty stomach 30-60 minutes before food or other medications.',
    monitoring_required: [
      'TSH every 6-8 weeks after dose changes',
      'ensure 4-hour separation from calcium, iron, magnesium supplements',
    ],
  },

  gabapentin: {
    generic_name: 'gabapentin',
    brand_names: ['Neurontin'],
    depletes: [
      {
        nutrient: 'Calcium',
        severity: 'moderate',
        mechanism:
          'Gabapentin may interfere with calcium absorption and metabolism. Long-term use has been associated with decreased bone mineral density, potentially through effects on calcium-dependent pathways.',
        symptoms_of_depletion: [
          'Bone pain',
          'Increased fracture risk with long-term use',
          'Muscle cramps',
          'Dental problems',
        ],
        recommended_supplement:
          'Calcium citrate 500-600mg twice daily with vitamin D3',
        evidence: 'moderate',
      },
      {
        nutrient: 'Vitamin D',
        severity: 'moderate',
        mechanism:
          'Gabapentin may accelerate vitamin D metabolism through induction of hepatic enzymes, similar to other anticonvulsants. This compounds the calcium absorption issue.',
        symptoms_of_depletion: [
          'Bone loss',
          'Muscle weakness',
          'Fatigue',
          'Depressed mood',
        ],
        recommended_supplement:
          'Vitamin D3 2000-4000 IU daily, monitor serum 25(OH)D levels',
        evidence: 'moderate',
      },
    ],
    monitoring_required: [
      'vitamin D levels annually',
      'DEXA scan if long-term use',
    ],
  },

  pantoprazole: {
    generic_name: 'pantoprazole',
    brand_names: ['Protonix'],
    depletes: [
      {
        nutrient: 'B12',
        severity: 'critical',
        mechanism:
          'Like all PPIs, pantoprazole drastically reduces stomach acid required to cleave B12 from food proteins. Without adequate acid, pepsin cannot liberate protein-bound B12 for absorption. Risk increases significantly after 2+ years of use.',
        symptoms_of_depletion: [
          'Peripheral neuropathy',
          'Fatigue and weakness',
          'Cognitive decline',
          'Macrocytic anemia',
          'Depression',
        ],
        recommended_supplement:
          'Methylcobalamin 1000-2000mcg sublingual daily (sublingual bypasses the acid-dependent absorption pathway)',
        evidence: 'strong',
      },
      {
        nutrient: 'Magnesium',
        severity: 'critical',
        mechanism:
          'PPIs impair both active and passive intestinal magnesium absorption by affecting TRPM6/TRPM7 ion channels in the gut. Hypomagnesemia can be severe and refractory to oral supplementation.',
        symptoms_of_depletion: [
          'Muscle cramps and spasms',
          'Cardiac arrhythmias',
          'Tremor',
          'Seizures in severe cases',
          'Fatigue',
          'Anxiety and irritability',
        ],
        recommended_supplement:
          'Magnesium glycinate 200-400mg daily',
        evidence: 'strong',
        fda_warning: true,
        fda_warning_text:
          'FDA safety communication (2011): Long-term PPI use may cause low serum magnesium levels.',
      },
      {
        nutrient: 'Zinc',
        severity: 'moderate',
        mechanism:
          'Reduced stomach acid impairs zinc solubility and absorption. Zinc requires an acidic environment for optimal ionization and uptake in the duodenum.',
        symptoms_of_depletion: [
          'Impaired immune function',
          'Slow wound healing',
          'Hair loss',
          'Taste changes',
        ],
        recommended_supplement:
          'Zinc picolinate 15-30mg daily, taken away from other minerals',
        evidence: 'moderate',
      },
      {
        nutrient: 'Iron',
        severity: 'moderate',
        mechanism:
          'Gastric acid is essential for converting ferric iron (Fe3+) to the absorbable ferrous form (Fe2+). PPI-induced hypochlorhydria reduces non-heme iron absorption.',
        symptoms_of_depletion: [
          'Fatigue and weakness',
          'Pale skin',
          'Shortness of breath',
          'Brittle nails',
        ],
        recommended_supplement:
          'Iron bisglycinate 25-50mg every other day with vitamin C. Take 2 hours apart from PPI.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Calcium',
        severity: 'moderate',
        mechanism:
          'PPI-induced hypochlorhydria reduces calcium carbonate solubility and absorption. Long-term PPI use is associated with increased hip fracture risk.',
        symptoms_of_depletion: [
          'Increased fracture risk',
          'Bone loss',
          'Muscle cramps',
        ],
        recommended_supplement:
          'Calcium citrate 500-600mg twice daily (citrate form does not require acid for absorption)',
        evidence: 'moderate',
      },
    ],
    liver_impact: 'low',
    liver_notes:
      'Pantoprazole is metabolized by CYP2C19. Generally fewer drug interactions than omeprazole.',
    notes:
      'Same class as omeprazole with similar depletion profile. Deprescribing should be considered for long-term users when clinically appropriate.',
  },

  furosemide: {
    generic_name: 'furosemide',
    brand_names: ['Lasix'],
    depletes: [
      {
        nutrient: 'Potassium',
        severity: 'critical',
        mechanism:
          'Loop diuretics block the Na-K-2Cl cotransporter in the thick ascending limb of the loop of Henle, causing massive potassium wasting in the urine. Hypokalemia can be severe and life-threatening, particularly in patients on digoxin.',
        symptoms_of_depletion: [
          'Muscle weakness and cramps',
          'Cardiac arrhythmias (potentially fatal)',
          'Fatigue',
          'Constipation',
          'Paralytic ileus in severe cases',
        ],
        recommended_supplement:
          'Potassium chloride 20-80 mEq daily as prescribed. Dietary potassium alone is usually insufficient. Often co-prescribed with potassium-sparing diuretic.',
        evidence: 'strong',
      },
      {
        nutrient: 'Magnesium',
        severity: 'critical',
        mechanism:
          'Loop diuretics inhibit magnesium reabsorption in the thick ascending limb. Hypomagnesemia is common and makes hypokalemia refractory to correction — magnesium must be repleted first.',
        symptoms_of_depletion: [
          'Muscle cramps and spasms',
          'Cardiac arrhythmias',
          'Tremor',
          'Refractory hypokalemia',
          'Seizures in severe cases',
        ],
        recommended_supplement:
          'Magnesium oxide or magnesium glycinate 400-800mg daily. Must correct magnesium before potassium will normalize.',
        evidence: 'strong',
      },
      {
        nutrient: 'Calcium',
        severity: 'high',
        mechanism:
          'Unlike thiazide diuretics, loop diuretics increase urinary calcium excretion by inhibiting passive paracellular calcium reabsorption in the thick ascending limb. Chronic use increases osteoporosis and fracture risk.',
        symptoms_of_depletion: [
          'Accelerated bone loss',
          'Increased fracture risk',
          'Muscle cramps',
          'Osteoporosis',
        ],
        recommended_supplement:
          'Calcium citrate 500-600mg twice daily with vitamin D3 2000-4000 IU daily',
        evidence: 'strong',
      },
      {
        nutrient: 'Zinc',
        severity: 'moderate',
        mechanism:
          'Loop diuretics increase urinary zinc excretion. Chronic use can lead to clinically relevant zinc depletion affecting immune function and wound healing.',
        symptoms_of_depletion: [
          'Impaired immune function',
          'Slow wound healing',
          'Taste disturbances',
          'Skin changes',
        ],
        recommended_supplement:
          'Zinc picolinate 15-30mg daily with food',
        evidence: 'moderate',
      },
      {
        nutrient: 'Thiamine (Vitamin B1)',
        severity: 'high',
        mechanism:
          'Loop diuretics increase renal thiamine clearance. Thiamine deficiency is particularly dangerous in heart failure patients, as thiamine is essential for cardiac energy metabolism. Depletion may worsen heart failure outcomes.',
        symptoms_of_depletion: [
          'Worsening heart failure',
          'Fatigue and weakness',
          'Peripheral neuropathy',
          'Cognitive impairment',
          'Edema (paradoxically worsening the condition being treated)',
        ],
        recommended_supplement:
          'Thiamine (benfotiamine) 100-300mg daily, especially in heart failure patients',
        evidence: 'strong',
        important_note:
          'Thiamine depletion in heart failure patients on furosemide can create a vicious cycle — thiamine deficiency worsens cardiac function, leading to increased diuretic doses, which further depletes thiamine.',
      },
    ],
    monitoring_required: [
      'electrolytes frequently',
      'magnesium',
      'calcium',
      'renal function',
    ],
    notes:
      'Loop diuretics cause the most extensive electrolyte depletions of any diuretic class. Thiamine depletion is underrecognized and particularly important in heart failure patients.',
  },

  tramadol: {
    generic_name: 'tramadol',
    brand_names: ['Ultram'],
    depletes: [
      {
        nutrient: 'Testosterone',
        severity: 'moderate',
        mechanism:
          'Chronic opioid use suppresses the hypothalamic-pituitary-gonadal (HPG) axis, reducing GnRH pulsatility and subsequent LH/FSH release. This leads to opioid-induced androgen deficiency (OPIAD), which can occur with chronic tramadol use.',
        symptoms_of_depletion: [
          'Fatigue and low energy',
          'Decreased libido',
          'Erectile dysfunction in men',
          'Muscle weakness and loss of mass',
          'Depressed mood',
          'Osteoporosis risk',
        ],
        recommended_supplement:
          'No OTC supplement replaces testosterone. If symptomatic, discuss hormone testing (total and free testosterone, LH, FSH) with prescriber. Testosterone replacement therapy may be warranted under medical supervision.',
        evidence: 'moderate',
      },
    ],
    notes:
      'Opioid-induced androgen deficiency is a recognized consequence of chronic opioid therapy. Risk increases with higher doses and longer duration of use. Also has serotonergic activity — caution with SSRIs/SNRIs due to serotonin syndrome risk.',
  },

  duloxetine: {
    generic_name: 'duloxetine',
    brand_names: ['Cymbalta'],
    depletes: [
      {
        nutrient: 'Melatonin',
        severity: 'moderate',
        mechanism:
          'SNRIs alter serotonin and norepinephrine metabolism, which can disrupt the serotonin-to-melatonin conversion pathway in the pineal gland, similar to SSRIs.',
        symptoms_of_depletion: [
          'Insomnia and sleep disturbances',
          'Disrupted circadian rhythm',
          'Difficulty falling asleep',
          'Non-restorative sleep',
        ],
        recommended_supplement:
          'Melatonin 0.5-3mg 30-60 minutes before bedtime. Start with lowest effective dose.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Folate',
        severity: 'moderate',
        mechanism:
          'Adequate folate status is required for serotonin and norepinephrine synthesis. Low folate impairs monoamine neurotransmitter production and is associated with poor antidepressant response.',
        symptoms_of_depletion: [
          'Treatment-resistant depression',
          'Poor antidepressant response',
          'Persistent fatigue',
          'Elevated homocysteine',
        ],
        recommended_supplement:
          'L-methylfolate 7.5-15mg daily as adjunct therapy to enhance antidepressant efficacy',
        evidence: 'moderate',
      },
    ],
    liver_impact: 'moderate',
    liver_notes:
      'Duloxetine is hepatically metabolized by CYP1A2 and CYP2D6. Cases of hepatotoxicity have been reported. Avoid in patients with substantial alcohol use or chronic liver disease.',
  },

  bupropion: {
    generic_name: 'bupropion',
    brand_names: ['Wellbutrin', 'Zyban'],
    depletes: [],
    notes:
      'No major nutrient depletions documented. Bupropion works via norepinephrine and dopamine reuptake inhibition, which does not significantly affect the nutrient depletion pathways seen with SSRIs/SNRIs. Lower risk of sexual side effects and weight gain compared to SSRIs.',
  },

  insulin: {
    generic_name: 'insulin',
    brand_names: ['Humalog', 'Novolog', 'Lantus', 'Levemir', 'Tresiba'],
    depletes: [
      {
        nutrient: 'Magnesium',
        severity: 'moderate',
        mechanism:
          'Insulin drives magnesium into cells and increases renal magnesium excretion. Patients with diabetes often have pre-existing magnesium deficiency from glycosuria, and insulin therapy can further deplete serum levels.',
        symptoms_of_depletion: [
          'Muscle cramps and spasms',
          'Insulin resistance (vicious cycle)',
          'Cardiac arrhythmias',
          'Fatigue',
          'Worsened blood sugar control',
        ],
        recommended_supplement:
          'Magnesium glycinate 200-400mg daily. Magnesium repletion may improve insulin sensitivity.',
        evidence: 'moderate',
        important_note:
          'Magnesium deficiency worsens insulin resistance, creating a vicious cycle. Correcting magnesium may improve glycemic control.',
      },
    ],
    monitoring_required: [
      'blood glucose frequently',
      'HbA1c every 3 months',
      'serum magnesium periodically',
    ],
  },

  albuterol: {
    generic_name: 'albuterol',
    brand_names: ['ProAir', 'Ventolin', 'Proventil'],
    depletes: [
      {
        nutrient: 'Potassium',
        severity: 'moderate',
        mechanism:
          'Beta-2 agonists stimulate the Na+/K+-ATPase pump, driving potassium from extracellular to intracellular compartments. Frequent use can cause transient hypokalemia. Risk increases with nebulized or frequent inhaler use.',
        symptoms_of_depletion: [
          'Muscle cramps',
          'Tremor',
          'Palpitations',
          'Weakness',
        ],
        recommended_supplement:
          'Increase dietary potassium (bananas, potatoes, leafy greens). Supplementation only under medical supervision, especially if also on diuretics.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Magnesium',
        severity: 'moderate',
        mechanism:
          'Beta-2 agonists can reduce serum magnesium levels through intracellular shifting, similar to potassium. Magnesium depletion may worsen bronchospasm.',
        symptoms_of_depletion: [
          'Muscle cramps',
          'Worsened bronchospasm',
          'Tremor',
          'Fatigue',
        ],
        recommended_supplement:
          'Magnesium glycinate 200-400mg daily. Adequate magnesium may help with bronchial relaxation.',
        evidence: 'moderate',
      },
    ],
    notes:
      'Electrolyte shifts are more clinically significant with frequent nebulizer use or high-dose inhaler use. Occasional rescue inhaler use is unlikely to cause significant depletion.',
  },

  montelukast: {
    generic_name: 'montelukast',
    brand_names: ['Singulair'],
    depletes: [],
    notes:
      'No major nutrient depletions documented. Montelukast is a leukotriene receptor antagonist. FDA boxed warning (2020) for neuropsychiatric events including suicidal ideation — monitor mood and behavior changes.',
  },

  simvastatin: {
    generic_name: 'simvastatin',
    brand_names: ['Zocor'],
    depletes: [
      {
        nutrient: 'CoQ10',
        severity: 'critical',
        mechanism:
          'Statins inhibit HMG-CoA reductase, which is also required for endogenous CoQ10 synthesis. Simvastatin may reduce circulating CoQ10 levels substantially. Simvastatin has a higher incidence of myopathy than some other statins.',
        symptoms_of_depletion: [
          'Muscle pain and weakness (higher risk than some other statins)',
          'Fatigue and exercise intolerance',
          'Brain fog',
          'Rhabdomyolysis in severe cases',
        ],
        recommended_supplement:
          'Ubiquinol 100-200mg daily (preferred over ubiquinone for better absorption)',
        evidence: 'strong',
      },
      {
        nutrient: 'Vitamin D',
        severity: 'moderate',
        mechanism:
          'Statins may interfere with cholesterol-dependent vitamin D synthesis pathways. Vitamin D is synthesized from 7-dehydrocholesterol, a cholesterol precursor affected by statin therapy.',
        symptoms_of_depletion: [
          'Bone pain',
          'Muscle weakness',
          'Depressed mood',
          'Impaired immune function',
        ],
        recommended_supplement:
          'Vitamin D3 2000-5000 IU daily, titrate based on serum 25(OH)D levels',
        evidence: 'moderate',
      },
    ],
    liver_impact: 'moderate',
    liver_notes:
      'Simvastatin is metabolized by CYP3A4. Higher risk of drug interactions and myopathy at 80mg dose — FDA limits this dose to patients already tolerating it for 12+ months.',
    muscle_pain_risk: 'high',
    notes:
      'Simvastatin has higher myopathy risk compared to atorvastatin and rosuvastatin, especially at 80mg dose. Multiple drug interactions via CYP3A4. CoQ10 supplementation is particularly important with this statin.',
  },

  pravastatin: {
    generic_name: 'pravastatin',
    brand_names: ['Pravachol'],
    depletes: [
      {
        nutrient: 'CoQ10',
        severity: 'moderate',
        mechanism:
          'Like all statins, pravastatin inhibits HMG-CoA reductase and reduces endogenous CoQ10 production. However, pravastatin is hydrophilic and has lower tissue penetration, which may result in somewhat less CoQ10 depletion than lipophilic statins.',
        symptoms_of_depletion: [
          'Muscle pain and weakness (lower risk than other statins)',
          'Fatigue',
          'Exercise intolerance',
        ],
        recommended_supplement:
          'Ubiquinol 100mg daily, especially if experiencing muscle symptoms',
        evidence: 'moderate',
      },
    ],
    muscle_pain_risk: 'lower_than_other_statins',
    notes:
      'Pravastatin is hydrophilic with fewer drug interactions (not metabolized by CYP3A4). Lower myopathy risk than simvastatin or atorvastatin. Good option for statin-sensitive patients.',
  },

  linagliptin: {
    generic_name: 'linagliptin',
    brand_names: ['Tradjenta'],
    depletes: [],
    notes:
      'No major nutrient depletions documented. DPP-4 inhibitors are generally well-tolerated with a favorable side effect profile. Does not require renal dose adjustment, unlike most other DPP-4 inhibitors.',
  },

  glipizide: {
    generic_name: 'glipizide',
    brand_names: ['Glucotrol'],
    depletes: [
      {
        nutrient: 'CoQ10',
        severity: 'moderate',
        mechanism:
          'Sulfonylureas may reduce CoQ10 levels through effects on mitochondrial function. CoQ10 is involved in pancreatic beta-cell energy metabolism and insulin secretion, so depletion may paradoxically impair the cells these drugs stimulate.',
        symptoms_of_depletion: [
          'Fatigue',
          'Muscle weakness',
          'Worsened glycemic control over time',
        ],
        recommended_supplement:
          'Ubiquinol 100mg daily',
        evidence: 'moderate',
      },
    ],
    notes:
      'Sulfonylureas carry hypoglycemia risk. CoQ10 depletion may contribute to progressive beta-cell decline seen with long-term sulfonylurea use.',
  },

  spironolactone: {
    generic_name: 'spironolactone',
    brand_names: ['Aldactone'],
    depletes: [
      {
        nutrient: 'Sodium',
        severity: 'moderate',
        mechanism:
          'Spironolactone blocks aldosterone receptors, reducing sodium reabsorption in the collecting duct. This can cause hyponatremia, especially in patients on salt-restricted diets or other diuretics.',
        symptoms_of_depletion: [
          'Dizziness and lightheadedness',
          'Headache',
          'Confusion in severe cases',
          'Nausea',
        ],
        recommended_supplement:
          'Monitor sodium levels. No routine supplementation — manage through dietary awareness and lab monitoring.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Folate',
        severity: 'low',
        mechanism:
          'Spironolactone may weakly inhibit folate absorption. The clinical significance is low but may be relevant in patients with pre-existing folate deficiency or those on other folate-depleting medications.',
        symptoms_of_depletion: [
          'Fatigue',
          'Elevated homocysteine',
        ],
        recommended_supplement:
          'L-methylfolate 400-800mcg daily if folate levels are low',
        evidence: 'emerging',
      },
    ],
    monitoring_required: [
      'potassium closely (risk of hyperkalemia)',
      'sodium',
      'renal function',
    ],
    notes:
      'Spironolactone is a potassium-SPARING diuretic — it RAISES potassium. Never supplement potassium with spironolactone. Hyperkalemia risk is highest when combined with ACE inhibitors, ARBs, or potassium supplements. Also has anti-androgen effects.',
  },

  amoxicillin: {
    generic_name: 'amoxicillin',
    brand_names: ['Amoxil'],
    depletes: [
      {
        nutrient: 'B vitamins',
        severity: 'moderate',
        mechanism:
          'Broad-spectrum antibiotics disrupt gut microbiome, reducing bacterial synthesis of B vitamins (especially B1, B2, B6, B12, biotin). The microbiome is a significant source of these vitamins, and disruption impairs this endogenous production.',
        symptoms_of_depletion: [
          'GI disturbances (diarrhea)',
          'Fatigue',
          'Mouth sores',
          'Mood changes',
        ],
        recommended_supplement:
          'B-complex vitamin during and for 2 weeks after antibiotic course. Probiotic (Saccharomyces boulardii or Lactobacillus rhamnosus GG) taken 2 hours apart from antibiotic.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Vitamin K',
        severity: 'moderate',
        mechanism:
          'Gut bacteria produce vitamin K2 (menaquinone). Antibiotic disruption of these bacteria reduces endogenous vitamin K production. Usually short-term and self-limiting after course completion.',
        symptoms_of_depletion: [
          'Easy bruising',
          'Increased bleeding tendency',
        ],
        recommended_supplement:
          'Vitamin K2 (MK-7) 100mcg daily during antibiotic course if concerned. Generally self-resolves after microbiome recovery.',
        evidence: 'moderate',
      },
    ],
    notes:
      'Depletions are short-term and typically resolve after antibiotic course and microbiome recovery. Probiotic co-administration may reduce antibiotic-associated diarrhea. Take probiotics at least 2 hours apart from the antibiotic dose.',
  },

  azithromycin: {
    generic_name: 'azithromycin',
    brand_names: ['Z-Pack', 'Zithromax'],
    depletes: [
      {
        nutrient: 'B vitamins',
        severity: 'moderate',
        mechanism:
          'Broad-spectrum antibiotics disrupt gut microbiome, reducing bacterial synthesis of B vitamins. Azithromycin has a long tissue half-life, so microbiome effects may persist longer than the dosing period.',
        symptoms_of_depletion: [
          'GI disturbances',
          'Fatigue',
          'Mouth sores',
        ],
        recommended_supplement:
          'B-complex vitamin during and for 2 weeks after antibiotic course. Probiotic taken 2 hours apart from antibiotic.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Vitamin K',
        severity: 'moderate',
        mechanism:
          'Disruption of vitamin K-producing gut bacteria. Effect may persist due to azithromycin long tissue half-life (68 hours).',
        symptoms_of_depletion: [
          'Easy bruising',
          'Increased bleeding tendency',
        ],
        recommended_supplement:
          'Vitamin K2 (MK-7) 100mcg daily during and shortly after course if concerned',
        evidence: 'moderate',
      },
    ],
    notes:
      'Short course (typically 5 days) but long tissue half-life means microbiome effects persist. QT prolongation risk — avoid combining with other QT-prolonging medications.',
  },

  ciprofloxacin: {
    generic_name: 'ciprofloxacin',
    brand_names: ['Cipro'],
    depletes: [
      {
        nutrient: 'Magnesium',
        severity: 'high',
        mechanism:
          'Fluoroquinolones chelate divalent cations including magnesium and may impair renal magnesium reabsorption. Magnesium depletion may contribute to the tendon damage and QT prolongation associated with this drug class.',
        symptoms_of_depletion: [
          'Muscle cramps and spasms',
          'Tendon pain (may compound fluoroquinolone tendon toxicity)',
          'Cardiac arrhythmias',
          'Fatigue',
          'Anxiety',
        ],
        recommended_supplement:
          'Magnesium glycinate 200-400mg daily — take at least 2 hours apart from ciprofloxacin (magnesium chelates the drug and reduces absorption)',
        evidence: 'strong',
        important_note:
          'Magnesium, calcium, iron, and zinc all chelate fluoroquinolones and must be taken at least 2 hours before or 6 hours after ciprofloxacin to avoid reducing antibiotic efficacy.',
      },
      {
        nutrient: 'Iron',
        severity: 'moderate',
        mechanism:
          'Fluoroquinolones chelate iron, reducing both iron absorption and antibiotic efficacy when taken together.',
        symptoms_of_depletion: [
          'Fatigue',
          'Reduced antibiotic efficacy if co-administered',
        ],
        recommended_supplement:
          'Iron supplements must be taken at least 2 hours before or 6 hours after ciprofloxacin',
        evidence: 'moderate',
      },
      {
        nutrient: 'Zinc',
        severity: 'moderate',
        mechanism:
          'Fluoroquinolones chelate zinc, and gut microbiome disruption further reduces zinc bioavailability.',
        symptoms_of_depletion: [
          'Impaired immune function',
          'Taste changes',
          'Slow wound healing',
        ],
        recommended_supplement:
          'Zinc picolinate 15-30mg daily — take at least 2 hours apart from ciprofloxacin',
        evidence: 'moderate',
      },
      {
        nutrient: 'Calcium',
        severity: 'moderate',
        mechanism:
          'Fluoroquinolones chelate calcium. Dairy products and calcium supplements significantly reduce ciprofloxacin absorption.',
        symptoms_of_depletion: [
          'Reduced antibiotic efficacy if co-administered',
        ],
        recommended_supplement:
          'Calcium supplements must be taken at least 2 hours before or 6 hours after ciprofloxacin',
        evidence: 'moderate',
      },
    ],
    notes:
      'Fluoroquinolones carry FDA boxed warnings for tendon rupture, peripheral neuropathy, and CNS effects. Magnesium depletion may exacerbate tendon toxicity. All divalent cation supplements must be separated by at least 2 hours before or 6 hours after dosing. Reserve for infections without safer alternatives.',
  },

  doxycycline: {
    generic_name: 'doxycycline',
    brand_names: ['Vibramycin', 'Doryx'],
    depletes: [
      {
        nutrient: 'Calcium',
        severity: 'moderate',
        mechanism:
          'Tetracyclines chelate calcium, forming insoluble complexes. This reduces both calcium absorption and antibiotic efficacy. Dairy products and calcium supplements must be avoided around dosing times.',
        symptoms_of_depletion: [
          'Reduced antibiotic efficacy if co-administered with calcium',
          'Bone effects with prolonged use',
        ],
        recommended_supplement:
          'Calcium supplements must be taken at least 2 hours apart from doxycycline. Avoid dairy within 1-2 hours of dosing.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Magnesium',
        severity: 'moderate',
        mechanism:
          'Tetracyclines chelate magnesium, reducing absorption of both the mineral and the antibiotic when taken together.',
        symptoms_of_depletion: [
          'Muscle cramps',
          'Fatigue',
        ],
        recommended_supplement:
          'Magnesium supplements must be taken at least 2 hours apart from doxycycline',
        evidence: 'moderate',
      },
      {
        nutrient: 'Iron',
        severity: 'moderate',
        mechanism:
          'Tetracyclines chelate iron, significantly reducing absorption of both. Iron supplements are a common cause of doxycycline treatment failure.',
        symptoms_of_depletion: [
          'Reduced antibiotic efficacy if co-administered',
        ],
        recommended_supplement:
          'Iron supplements must be taken at least 2 hours apart from doxycycline',
        evidence: 'moderate',
      },
    ],
    notes:
      'Doxycycline absorption is reduced by dairy, calcium, iron, magnesium, and aluminum antacids. Take on an empty stomach with a full glass of water. Sit upright for 30 minutes after taking to prevent esophageal erosion. Sun sensitivity is common — use sunscreen.',
  },

  fluoxetine: {
    generic_name: 'fluoxetine',
    brand_names: ['Prozac'],
    depletes: [
      {
        nutrient: 'Melatonin',
        severity: 'moderate',
        mechanism:
          'SSRIs alter serotonin metabolism which affects the serotonin-to-melatonin conversion pathway in the pineal gland. Fluoxetine specifically has a long half-life, prolonging this effect.',
        symptoms_of_depletion: [
          'Insomnia and sleep disturbances',
          'Disrupted circadian rhythm',
          'Difficulty falling asleep',
          'Non-restorative sleep',
        ],
        recommended_supplement:
          'Melatonin 0.5-3mg 30-60 minutes before bedtime. Start with lowest effective dose.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Folate',
        severity: 'moderate',
        mechanism:
          'Adequate folate is required for serotonin synthesis via the BH4 pathway. Low folate impairs serotonin production and is associated with SSRI non-response. Folate supplementation may enhance SSRI efficacy.',
        symptoms_of_depletion: [
          'Treatment-resistant depression',
          'Poor SSRI response',
          'Persistent fatigue',
          'Elevated homocysteine',
        ],
        recommended_supplement:
          'L-methylfolate 7.5-15mg daily as adjunct therapy',
        evidence: 'strong',
      },
    ],
    liver_impact: 'low',
    liver_notes:
      'Fluoxetine is a potent CYP2D6 inhibitor. Long half-life (4-6 days for active metabolite norfluoxetine) — drug interactions persist weeks after discontinuation.',
  },

  sertraline: {
    generic_name: 'sertraline',
    brand_names: ['Zoloft'],
    depletes: [
      {
        nutrient: 'Melatonin',
        severity: 'moderate',
        mechanism:
          'SSRIs alter serotonin metabolism which affects the serotonin-to-melatonin conversion pathway in the pineal gland.',
        symptoms_of_depletion: [
          'Insomnia and sleep disturbances',
          'Disrupted circadian rhythm',
          'Difficulty falling asleep',
        ],
        recommended_supplement:
          'Melatonin 0.5-3mg 30-60 minutes before bedtime',
        evidence: 'moderate',
      },
      {
        nutrient: 'Folate',
        severity: 'moderate',
        mechanism:
          'Adequate folate is required for serotonin synthesis. Low folate is associated with SSRI non-response and treatment-resistant depression.',
        symptoms_of_depletion: [
          'Treatment-resistant depression',
          'Poor SSRI response',
          'Persistent fatigue',
          'Elevated homocysteine',
        ],
        recommended_supplement:
          'L-methylfolate 7.5-15mg daily as adjunct therapy',
        evidence: 'strong',
      },
    ],
  },

  escitalopram: {
    generic_name: 'escitalopram',
    brand_names: ['Lexapro'],
    depletes: [
      {
        nutrient: 'Melatonin',
        severity: 'moderate',
        mechanism:
          'SSRIs alter serotonin metabolism which affects the serotonin-to-melatonin conversion pathway in the pineal gland.',
        symptoms_of_depletion: [
          'Insomnia and sleep disturbances',
          'Disrupted circadian rhythm',
          'Difficulty falling asleep',
        ],
        recommended_supplement:
          'Melatonin 0.5-3mg 30-60 minutes before bedtime',
        evidence: 'moderate',
      },
      {
        nutrient: 'Folate',
        severity: 'moderate',
        mechanism:
          'Adequate folate is required for serotonin synthesis. Low folate is associated with SSRI non-response.',
        symptoms_of_depletion: [
          'Treatment-resistant depression',
          'Poor SSRI response',
          'Persistent fatigue',
          'Elevated homocysteine',
        ],
        recommended_supplement:
          'L-methylfolate 7.5-15mg daily as adjunct therapy',
        evidence: 'strong',
      },
    ],
  },

  venlafaxine: {
    generic_name: 'venlafaxine',
    brand_names: ['Effexor'],
    depletes: [
      {
        nutrient: 'Melatonin',
        severity: 'moderate',
        mechanism:
          'SNRIs alter serotonin and norepinephrine metabolism, disrupting the serotonin-to-melatonin conversion pathway.',
        symptoms_of_depletion: [
          'Insomnia and sleep disturbances',
          'Disrupted circadian rhythm',
          'Difficulty falling asleep',
        ],
        recommended_supplement:
          'Melatonin 0.5-3mg 30-60 minutes before bedtime',
        evidence: 'moderate',
      },
      {
        nutrient: 'Folate',
        severity: 'moderate',
        mechanism:
          'Adequate folate is required for monoamine neurotransmitter synthesis. Low folate impairs serotonin and norepinephrine production and is associated with antidepressant non-response.',
        symptoms_of_depletion: [
          'Treatment-resistant depression',
          'Poor antidepressant response',
          'Persistent fatigue',
          'Elevated homocysteine',
        ],
        recommended_supplement:
          'L-methylfolate 7.5-15mg daily as adjunct therapy',
        evidence: 'moderate',
      },
    ],
    notes:
      'Venlafaxine has significant discontinuation syndrome — never stop abruptly. Must be tapered gradually. At higher doses (>150mg), norepinephrine reuptake inhibition becomes more prominent. Monitor blood pressure.',
  },

  alprazolam: {
    generic_name: 'alprazolam',
    brand_names: ['Xanax'],
    depletes: [
      {
        nutrient: 'Melatonin',
        severity: 'low',
        mechanism:
          'Benzodiazepines may suppress melatonin secretion by enhancing GABAergic inhibition of the pineal gland. This can paradoxically worsen the insomnia they are sometimes prescribed for.',
        symptoms_of_depletion: [
          'Disrupted sleep architecture',
          'Rebound insomnia',
          'Difficulty maintaining natural sleep-wake cycle',
        ],
        recommended_supplement:
          'Melatonin 0.5-1mg at bedtime may support natural sleep architecture. Discuss with prescriber as melatonin may be used as part of benzodiazepine tapering strategy.',
        evidence: 'emerging',
      },
    ],
    notes:
      'Benzodiazepines carry risk of dependence and tolerance. Not recommended for long-term use. Melatonin has been studied as an adjunct to facilitate benzodiazepine tapering.',
  },

  pregabalin: {
    generic_name: 'pregabalin',
    brand_names: ['Lyrica'],
    depletes: [
      {
        nutrient: 'Calcium',
        severity: 'moderate',
        mechanism:
          'Pregabalin binds to the alpha-2-delta subunit of voltage-gated calcium channels and may interfere with calcium-dependent processes. Long-term use has been associated with decreased bone mineral density.',
        symptoms_of_depletion: [
          'Bone pain',
          'Increased fracture risk with long-term use',
          'Muscle cramps',
        ],
        recommended_supplement:
          'Calcium citrate 500-600mg twice daily with vitamin D3',
        evidence: 'moderate',
      },
      {
        nutrient: 'Vitamin D',
        severity: 'moderate',
        mechanism:
          'Similar to gabapentin, pregabalin may accelerate vitamin D catabolism. This compounds the calcium absorption concern.',
        symptoms_of_depletion: [
          'Bone loss',
          'Muscle weakness',
          'Fatigue',
          'Depressed mood',
        ],
        recommended_supplement:
          'Vitamin D3 2000-4000 IU daily, monitor serum 25(OH)D levels',
        evidence: 'moderate',
      },
    ],
    monitoring_required: [
      'vitamin D levels annually',
      'DEXA scan if long-term use',
    ],
    notes:
      'Schedule V controlled substance with abuse potential. Similar depletion profile to gabapentin. Weight gain and peripheral edema are common side effects.',
  },

  celecoxib: {
    generic_name: 'celecoxib',
    brand_names: ['Celebrex'],
    depletes: [
      {
        nutrient: 'Folate',
        severity: 'low',
        mechanism:
          'NSAIDs may interfere with folate metabolism, though COX-2 selective inhibitors like celecoxib have less impact than traditional NSAIDs.',
        symptoms_of_depletion: [
          'Elevated homocysteine with chronic use',
          'Fatigue',
        ],
        recommended_supplement:
          'L-methylfolate 400-800mcg daily if on chronic therapy',
        evidence: 'emerging',
      },
    ],
    notes:
      'Lower GI bleeding risk than traditional NSAIDs, but still carries cardiovascular risk (FDA boxed warning). GI microbleeding-related iron loss is less common than with non-selective NSAIDs.',
  },

  ibuprofen: {
    generic_name: 'ibuprofen',
    brand_names: ['Advil', 'Motrin'],
    depletes: [
      {
        nutrient: 'Folate',
        severity: 'low',
        mechanism:
          'NSAIDs may interfere with folate transport and metabolism. Clinical significance increases with chronic daily use.',
        symptoms_of_depletion: [
          'Elevated homocysteine with chronic use',
          'Fatigue',
        ],
        recommended_supplement:
          'L-methylfolate 400-800mcg daily if on chronic therapy',
        evidence: 'emerging',
      },
      {
        nutrient: 'Iron',
        severity: 'moderate',
        mechanism:
          'Chronic NSAID use causes GI mucosal injury and microbleeding, leading to occult blood loss and gradual iron depletion. This is a significant cause of iron-deficiency anemia in chronic NSAID users.',
        symptoms_of_depletion: [
          'Fatigue and weakness',
          'Pale skin',
          'Shortness of breath',
          'Dark or tarry stools',
        ],
        recommended_supplement:
          'Iron bisglycinate 25mg every other day if ferritin is low. Monitor for GI bleeding with periodic stool occult blood testing.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Vitamin C',
        severity: 'low',
        mechanism:
          'NSAIDs may reduce gastric vitamin C concentrations by affecting active transport mechanisms in the gastric mucosa.',
        symptoms_of_depletion: [
          'Slower wound healing',
          'Increased bruising',
        ],
        recommended_supplement:
          'Vitamin C 500mg daily if on chronic therapy',
        evidence: 'emerging',
      },
    ],
    notes:
      'Occasional use is unlikely to cause significant depletions. Chronic daily use (common in arthritis patients) carries meaningful risk of iron depletion from GI microbleeding and should include periodic CBC monitoring.',
  },

  acetaminophen: {
    generic_name: 'acetaminophen',
    brand_names: ['Tylenol'],
    depletes: [
      {
        nutrient: 'Glutathione',
        severity: 'high',
        mechanism:
          'Acetaminophen metabolism via CYP2E1 produces the toxic metabolite NAPQI, which is detoxified by conjugation with glutathione. Chronic use or high doses deplete hepatic glutathione stores, increasing vulnerability to liver damage. This is the mechanism of acetaminophen overdose toxicity.',
        symptoms_of_depletion: [
          'Increased liver vulnerability',
          'Reduced detoxification capacity',
          'Oxidative stress',
          'Liver damage in severe depletion',
        ],
        recommended_supplement:
          'N-acetylcysteine (NAC) 600mg 1-2 times daily — NAC is the direct precursor to glutathione and is the clinical antidote for acetaminophen overdose. Supports hepatic glutathione repletion.',
        evidence: 'strong',
        important_note:
          'NAC (N-acetylcysteine) is the established clinical antidote for acetaminophen toxicity because it directly replenishes glutathione. For chronic acetaminophen users, NAC supplementation provides hepatoprotective support.',
      },
    ],
    liver_impact: 'high',
    liver_notes:
      'Acetaminophen is the leading cause of acute liver failure in the US. Maximum daily dose is 3g (some guidelines say 2g) for chronic use. Alcohol use dramatically increases hepatotoxicity risk. Never exceed 4g/day under any circumstances.',
  },

  aspirin: {
    generic_name: 'aspirin',
    brand_names: ['Bayer', 'Ecotrin'],
    depletes: [
      {
        nutrient: 'Vitamin C',
        severity: 'moderate',
        mechanism:
          'Aspirin increases urinary excretion of vitamin C and may impair vitamin C uptake by tissues. Chronic aspirin use can reduce plasma and leukocyte vitamin C concentrations.',
        symptoms_of_depletion: [
          'Increased bruising',
          'Slower wound healing',
          'Weakened immune function',
          'Fatigue',
        ],
        recommended_supplement:
          'Vitamin C 500-1000mg daily',
        evidence: 'moderate',
      },
      {
        nutrient: 'Iron',
        severity: 'moderate',
        mechanism:
          'Aspirin causes GI mucosal erosion and microbleeding, even at low cardioprotective doses (81mg). Chronic occult blood loss can lead to iron-deficiency anemia over time.',
        symptoms_of_depletion: [
          'Fatigue and weakness',
          'Pale skin',
          'Dark or tarry stools',
          'Iron-deficiency anemia',
        ],
        recommended_supplement:
          'Monitor ferritin and CBC periodically. Iron bisglycinate 25mg every other day if ferritin is low.',
        evidence: 'moderate',
      },
      {
        nutrient: 'Folate',
        severity: 'low',
        mechanism:
          'High-dose aspirin may interfere with folate absorption and increase urinary folate excretion. Effect is less significant at low cardioprotective doses.',
        symptoms_of_depletion: [
          'Elevated homocysteine',
          'Fatigue',
        ],
        recommended_supplement:
          'L-methylfolate 400-800mcg daily if on chronic high-dose aspirin',
        evidence: 'emerging',
      },
    ],
    notes:
      'Low-dose aspirin (81mg) for cardiovascular protection has a lower depletion impact than high-dose aspirin (325mg+) for pain. GI bleeding risk applies even at low doses. Enteric coating may reduce but does not eliminate GI effects.',
  },

  colchicine: {
    generic_name: 'colchicine',
    brand_names: ['Colcrys', 'Mitigare'],
    depletes: [
      {
        nutrient: 'B12',
        severity: 'high',
        mechanism:
          'Colchicine disrupts ileal absorptive cell function by interfering with microtubule-dependent endocytosis of the intrinsic factor-B12 complex. This is a direct, dose-dependent effect on B12 absorption.',
        symptoms_of_depletion: [
          'Peripheral neuropathy',
          'Fatigue and weakness',
          'Cognitive decline',
          'Macrocytic anemia',
          'Depression',
        ],
        recommended_supplement:
          'Methylcobalamin 1000-2000mcg sublingual daily. B12 injections if levels significantly low.',
        evidence: 'strong',
      },
      {
        nutrient: 'Fat-soluble vitamins (A, D, E, K)',
        severity: 'moderate',
        mechanism:
          'Colchicine can cause malabsorption by disrupting intestinal epithelial cell function and microtubule-dependent nutrient transport, affecting fat-soluble vitamin absorption.',
        symptoms_of_depletion: [
          'Bone loss (vitamin D)',
          'Impaired immune function (vitamin A)',
          'Increased bleeding tendency (vitamin K)',
          'Oxidative stress (vitamin E)',
        ],
        recommended_supplement:
          'Vitamin D3 2000-4000 IU daily. Monitor fat-soluble vitamin levels if on long-term therapy.',
        evidence: 'moderate',
      },
    ],
    monitoring_required: [
      'B12 levels',
      'CBC',
      'liver and renal function',
      'vitamin D',
    ],
    notes:
      'Colchicine has a narrow therapeutic index. GI side effects (diarrhea, nausea) are common and dose-limiting. Dose must be reduced in renal or hepatic impairment. Avoid grapefruit juice (CYP3A4 interaction).',
  },

  allopurinol: {
    generic_name: 'allopurinol',
    brand_names: ['Zyloprim'],
    depletes: [],
    notes:
      'No major nutrient depletions documented. Allopurinol is a xanthine oxidase inhibitor used for gout and hyperuricemia. Rare but serious risk of severe hypersensitivity reaction (DRESS syndrome, Stevens-Johnson syndrome) — HLA-B*5801 testing recommended in high-risk populations before initiation.',
  },

};
