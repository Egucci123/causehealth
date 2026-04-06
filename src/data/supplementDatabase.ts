import type { SupplementInfo } from '@/types/medication.types';

export const SUPPLEMENT_DATABASE: Record<string, SupplementInfo> = {
  magnesium_glycinate: {
    name: 'Magnesium Glycinate',
    category: 'minerals',
    evidence_rating: 5,
    primary_uses: ['sleep', 'muscle_pain', 'stress', 'insulin_sensitivity', 'headaches', 'constipation'],
    dose_standard: '400mg',
    timing: 'bedtime',
    timing_notes:
      'Take at bedtime for sleep benefit. Glycinate form has calming effect via glycine receptor agonism. Separate from calcium, iron, and zinc supplements by 2 hours to avoid competitive absorption. Can split dose 200mg morning / 200mg evening if used for muscle pain or stress.',
    form_matters: true,
    best_form: 'Glycinate or malate — avoid oxide which has poor absorption',
    drug_interactions: [
      'May reduce absorption of bisphosphonates, tetracycline, and fluoroquinolone antibiotics — separate by 2-4 hours',
      'Potentiates effects of muscle relaxants and sedatives',
      'May lower blood pressure — monitor if on antihypertensives',
      'Reduces absorption of levothyroxine — separate by 4 hours',
    ],
    time_to_benefit: '2-4 weeks for sleep, 4-8 weeks for muscle pain',
    cost_monthly: '$15-25',
    quality_note: 'Look for chelated forms (glycinate, malate, taurate). Avoid magnesium oxide and citrate for systemic benefit — citrate is primarily useful as a laxative.',
  },

  vitamin_d3_k2: {
    name: 'Vitamin D3 + K2',
    category: 'vitamins',
    evidence_rating: 5,
    primary_uses: ['immune_support', 'bone_health', 'ibd_management', 'mood', 'autoimmune_modulation'],
    dose_standard: 'D3: 4000 IU + K2 MK-7: 100-200mcg',
    timing: 'morning_with_fat',
    timing_notes:
      'Must be taken with a fat-containing meal for absorption — vitamin D is fat-soluble. Morning dosing preferred as evening D3 may interfere with melatonin production. K2 MK-7 directs calcium to bones and away from arterial walls. Retest 25-OH vitamin D levels after 3 months of supplementation.',
    form_matters: true,
    best_form: 'D3 (cholecalciferol) NOT D2. K2 MK-7 form only',
    target_level: '50-70 ng/mL',
    drug_interactions: [
      'Enhances calcium absorption — monitor calcium levels if on thiazide diuretics',
      'K2 may interact with warfarin and other vitamin K antagonists — consult prescriber before starting',
      'Corticosteroids impair vitamin D metabolism — higher doses may be needed',
      'Cholestyramine and orlistat reduce absorption — separate by 4 hours',
    ],
    time_to_benefit: '4-8 weeks to see level changes, 8-12 weeks for clinical benefit',
    cost_monthly: '$15-20',
    quality_note: 'Ensure D3 not D2. K2 should specify MK-7 form. Combination products simplify compliance.',
  },

  fish_oil: {
    name: 'Fish Oil EPA + DHA',
    category: 'essential_fatty_acids',
    evidence_rating: 5,
    primary_uses: ['triglyceride_reduction', 'anti_inflammatory', 'cardiovascular', 'ibd_support', 'brain_health'],
    dose_standard: '3-4g combined EPA+DHA daily',
    timing: 'with_largest_meal',
    timing_notes:
      'Take with the largest meal of the day for maximum absorption — fat content in the meal enhances omega-3 bioavailability by up to 300%. Split into 2 doses if GI discomfort occurs. Freeze capsules if experiencing fishy burps. Higher EPA ratio preferred for anti-inflammatory and triglyceride-lowering effects.',
    form_matters: true,
    best_form: 'Triglyceride form over ethyl ester',
    dose_for_triglycerides: '4g EPA+DHA minimum',
    drug_interactions: [
      'May potentiate anticoagulant effects of warfarin, aspirin, and other blood thinners — monitor INR',
      'Additive blood pressure lowering with antihypertensives',
      'High-dose fish oil may increase LDL-C slightly in some patients — monitor lipid panel',
      'May enhance effects of statin therapy on triglycerides',
    ],
    time_to_benefit: '4-6 weeks for triglyceride reduction, 8-12 weeks for anti-inflammatory benefit',
    cost_monthly: '$20-40',
    quality_note: 'Look for third-party tested (IFOS 5-star rated) products. Check total EPA+DHA per serving, not just total fish oil. Triglyceride form absorbs 70% better than ethyl ester.',
  },

  coq10: {
    name: 'CoQ10',
    category: 'mitochondrial',
    evidence_rating: 5,
    primary_uses: ['statin_support', 'energy', 'cardiovascular', 'migraine_prevention', 'blood_pressure'],
    dose_standard: '200mg daily',
    timing: 'morning_with_fat',
    timing_notes:
      'Take with a fat-containing meal in the morning for optimal absorption. CoQ10 is fat-soluble and requires dietary fat for bioavailability. Morning dosing preferred as CoQ10 supports cellular energy production. Softgel or oil-based formulations absorb better than powder capsules.',
    form_matters: true,
    best_form: 'Ubiquinol if over 40',
    specific_indication: 'Critical for anyone on statins',
    drug_interactions: [
      'Statins deplete CoQ10 — supplementation is strongly recommended for all statin users',
      'May reduce effectiveness of warfarin — monitor INR closely',
      'May enhance blood pressure lowering effects of antihypertensives',
      'Beta-blockers and certain diabetes medications also deplete CoQ10',
    ],
    time_to_benefit: '4-8 weeks for energy improvement, 12 weeks for measurable cardiovascular benefit',
    cost_monthly: '$25-45',
    quality_note: 'Ubiquinol is the reduced (active) form and is better absorbed, especially over age 40. Ubiquinone requires enzymatic conversion that declines with age. Look for Kaneka ubiquinol.',
  },

  berberine: {
    name: 'Berberine HCl',
    category: 'metabolic',
    evidence_rating: 5,
    primary_uses: ['insulin_sensitivity', 'blood_sugar', 'triglycerides', 'gut_health', 'metabolic_syndrome'],
    dose_standard: '500mg twice daily with meals',
    timing: 'with_meals',
    timing_notes:
      'Take with meals to reduce GI side effects and enhance glucose-lowering effect. Split dosing (500mg twice daily) is more effective than single dose due to short half-life. Start with 500mg once daily for first week to assess GI tolerance, then increase. Do not take on empty stomach.',
    form_matters: true,
    best_form: 'Berberine HCl standardized to 97%+ purity',
    mechanism:
      'Activates AMPK (AMP-activated protein kinase) — the same metabolic master switch targeted by metformin. Improves insulin receptor sensitivity, increases glucose uptake into cells, reduces hepatic glucose production, and modulates gut microbiome composition. Clinical trials show comparable efficacy to metformin for glycemic control.',
    drug_interactions: [
      'Potentiates metformin — risk of hypoglycemia when combined. Monitor blood sugar closely and consider dose reduction of metformin',
      'Inhibits CYP3A4, CYP2D6, and CYP2C9 — interacts with many medications metabolized by these pathways',
      'May increase levels of cyclosporine, statins, and macrolide antibiotics',
      'Do not combine with other hypoglycemic agents without medical supervision',
    ],
    contraindications: [
      'Pregnancy and breastfeeding — absolutely contraindicated',
      'Concurrent use with strong CYP3A4 inhibitors',
      'Neonates — risk of kernicterus',
    ],
    time_to_benefit: '4-8 weeks for metabolic parameters, 8-12 weeks for lipid changes',
    cost_monthly: '$20-35',
  },

  methylfolate: {
    name: 'Methylfolate (5-MTHF)',
    category: 'b_vitamins',
    evidence_rating: 5,
    primary_uses: ['methylation_support', 'depression', 'homocysteine', 'ibd_support', 'mthfr'],
    dose_standard: '800mcg-1mg standard, up to 15mg for MTHFR',
    timing: 'morning',
    timing_notes:
      'Take in the morning as methylfolate supports neurotransmitter synthesis and energy metabolism. Can be taken with or without food. Start at lower dose and titrate up — some patients experience overmethylation symptoms (anxiety, irritability, insomnia) at higher doses. Combine with methylcobalamin B12 for optimal methylation support.',
    form_matters: true,
    best_form: 'L-methylfolate (Quatrefolic or Metafolin brands) — must be the active 5-MTHF form',
    critical_note:
      'Never use folic acid — it is synthetic, requires MTHFR enzyme conversion, and may accumulate as unmetabolized folic acid (UMFA) which is associated with immune dysfunction and may mask B12 deficiency. Patients with MTHFR polymorphisms cannot efficiently convert folic acid to the active form. Always use methylfolate (5-MTHF).',
    drug_interactions: [
      'Mesalamine inhibits folate absorption — higher doses may be required in IBD patients',
      'Methotrexate is a folate antagonist — methylfolate supplementation is essential but must be timed appropriately (not same day as methotrexate in some protocols)',
      'Phenytoin and carbamazepine deplete folate stores',
      'SSRIs may have enhanced efficacy when combined with methylfolate (adjunctive use supported by clinical trials)',
    ],
    time_to_benefit: '2-4 weeks for mood improvement, 4-8 weeks for homocysteine reduction',
    cost_monthly: '$15-25',
  },

  methylcobalamin_b12: {
    name: 'Methylcobalamin B12',
    category: 'b_vitamins',
    evidence_rating: 5,
    primary_uses: ['energy', 'nerve_health', 'methylation', 'ibd_support', 'medication_depletion'],
    dose_standard: '1000mcg daily',
    timing: 'morning_sublingual',
    timing_notes:
      'Sublingual administration bypasses GI absorption, which is critical for IBD patients with ileal disease or resection, and for patients on PPIs or metformin which impair B12 absorption. Take in the morning as B12 supports energy metabolism and may interfere with sleep if taken late. Hold under tongue for 30 seconds before swallowing.',
    form_matters: true,
    best_form: 'Methylcobalamin or hydroxocobalamin — avoid cyanocobalamin which requires hepatic conversion and releases trace cyanide',
    specific_for: 'IBD patients, anyone on metformin, PPIs, or mesalamine',
    drug_interactions: [
      'Metformin reduces B12 absorption by up to 30% — supplementation strongly recommended',
      'PPIs and H2 blockers reduce gastric acid needed for B12 liberation from food',
      'Mesalamine impairs ileal B12 absorption',
      'Nitrous oxide (anesthetic) inactivates B12 — supplement before and after procedures',
      'Colchicine reduces B12 absorption',
    ],
    time_to_benefit: '2-4 weeks for energy, 3-6 months for neurological symptom improvement',
    cost_monthly: '$10-20',
  },

  zinc_bisglycinate: {
    name: 'Zinc Bisglycinate',
    category: 'minerals',
    evidence_rating: 4,
    primary_uses: ['immune_support', 'gut_health', 'hair_health', 'wound_healing', 'testosterone_support'],
    dose_standard: '25-30mg daily',
    timing: 'with_food',
    timing_notes:
      'Take with food to minimize nausea — zinc on an empty stomach commonly causes GI distress. Avoid taking with high-phytate foods (whole grains, legumes) which chelate zinc and reduce absorption by up to 50%. Separate from iron and calcium supplements by 2 hours as they compete for absorption.',
    form_matters: true,
    best_form: 'Bisglycinate (chelated) for best absorption and GI tolerance. Picolinate is also well-absorbed. Avoid zinc oxide and sulfate.',
    upper_limit: '40mg daily — do not exceed. Excess zinc depletes copper.',
    drug_interactions: [
      'Reduces absorption of tetracycline and fluoroquinolone antibiotics — separate by 2 hours',
      'Penicillamine (Wilson disease) — zinc reduces its absorption',
      'Thiazide diuretics increase zinc excretion',
      'Long-term zinc supplementation above 40mg depletes copper — consider copper 1-2mg if using zinc long-term',
    ],
    time_to_benefit: '4-8 weeks for immune benefit, 3-6 months for hair and skin improvement',
    cost_monthly: '$10-20',
  },

  ashwagandha: {
    name: 'Ashwagandha (KSM-66)',
    category: 'adaptogens',
    evidence_rating: 4,
    primary_uses: ['stress', 'cortisol_modulation', 'sleep', 'thyroid_support', 'testosterone_support'],
    dose_standard: '600mg daily',
    timing: 'morning_or_evening',
    timing_notes:
      'Timing depends on primary goal — morning for energy and stress resilience, evening for sleep support. Can split 300mg morning / 300mg evening. Take with food to enhance absorption of withanolides. Full-spectrum root extract (KSM-66) has the most clinical evidence. Allow 4-6 weeks for full adaptogenic effect.',
    form_matters: true,
    best_form: 'KSM-66 full-spectrum root extract standardized to 5% withanolides',
    contraindications: [
      'Autoimmune conditions — use with caution, discuss with doctor',
      'Thyroid disorders without medical supervision',
    ],
    drug_interactions: [
      'May enhance effects of thyroid hormone medications — monitor thyroid levels',
      'May potentiate sedatives, benzodiazepines, and sleep medications',
      'May enhance effects of immunosuppressants due to immune-modulating properties',
      'Theoretical interaction with diabetes medications due to blood sugar lowering effect',
    ],
    time_to_benefit: '4-6 weeks for stress and cortisol modulation, 8-12 weeks for testosterone and body composition changes',
    cost_monthly: '$20-30',
  },

  psyllium_husk: {
    name: 'Psyllium Husk',
    category: 'fiber',
    evidence_rating: 5,
    primary_uses: ['cholesterol_reduction', 'blood_sugar', 'digestive_health', 'satiety', 'ibd_remission'],
    dose_standard: '5-10g daily',
    timing: 'before_meals_with_water',
    timing_notes:
      'Take 30 minutes before meals with a full glass of water (minimum 8oz) — inadequate water can cause GI obstruction. Start with 2.5g daily and increase gradually over 2 weeks to reduce bloating and gas. Split into 2-3 doses for cholesterol benefit. Must be taken separately from medications by at least 2 hours as it can reduce drug absorption.',
    form_matters: false,
    mechanism:
      'Soluble fiber that forms a viscous gel in the GI tract, binding bile acids and forcing the liver to use cholesterol to synthesize new bile acids — effectively lowering LDL-C by 5-15%. Also slows glucose absorption, improving postprandial glycemic control. Prebiotic effect supports beneficial gut microbiome composition. FDA-approved health claim for cardiovascular benefit.',
    drug_interactions: [
      'Reduces absorption of virtually all oral medications — always separate by 2 hours before or after',
      'May enhance effects of diabetes medications by lowering blood sugar — monitor glucose',
      'May reduce absorption of levothyroxine, lithium, carbamazepine, and digoxin',
      'May enhance anticoagulant effect by reducing vitamin K absorption',
    ],
    time_to_benefit: '2-4 weeks for cholesterol reduction, immediate effect on blood sugar regulation',
    cost_monthly: '$10-15',
  },

  l_glutamine: {
    name: 'L-Glutamine',
    category: 'amino_acids',
    evidence_rating: 4,
    primary_uses: ['gut_lining_repair', 'ibd_support', 'intestinal_permeability', 'muscle_recovery', 'immune_support'],
    dose_standard: '5-10g daily (IBD patients 10-15g)',
    timing: 'morning_empty_stomach',
    timing_notes:
      'Take on an empty stomach for maximum intestinal uptake — glutamine is preferentially absorbed by enterocytes when not competing with other amino acids from food. Morning dosing before breakfast is ideal. Can split into 2-3 doses throughout the day between meals for IBD patients on higher doses. Mix powder in room-temperature water — heat degrades glutamine.',
    form_matters: false,
    specific_for: 'IBD patients — colonocytes use glutamine as primary fuel source',
    drug_interactions: [
      'Lactulose — glutamine may reduce effectiveness for hepatic encephalopathy',
      'Chemotherapy agents — consult oncologist before use during active cancer treatment',
      'Generally well-tolerated with minimal drug interactions',
      'May affect blood sugar in diabetic patients — monitor glucose',
    ],
    time_to_benefit: '2-4 weeks for gut symptom improvement, 4-8 weeks for intestinal permeability changes',
    cost_monthly: '$20-30',
    quality_note: 'Pharmaceutical-grade L-glutamine powder is most cost-effective. Avoid products with added sugars or fillers.',
  },

  zinc_carnosine: {
    name: 'Zinc Carnosine',
    category: 'gut_health',
    evidence_rating: 4,
    primary_uses: ['gut_lining_repair', 'gastric_protection', 'h_pylori_adjunct', 'nsaid_protection', 'ibd_support'],
    dose_standard: '75mg twice daily',
    timing: 'with_meals',
    timing_notes:
      'Take with meals for optimal gastric and intestinal protective effect. The zinc carnosine complex dissociates slowly in the GI tract, providing prolonged mucosal contact time. This is distinct from regular zinc supplementation — the chelated complex has unique mucosal healing properties. Morning and evening dosing provides consistent GI coverage.',
    form_matters: true,
    best_form: 'Must be zinc carnosine complex — not zinc and carnosine separately',
    drug_interactions: [
      'Reduces absorption of tetracycline and fluoroquinolone antibiotics — separate by 2 hours',
      'Counts toward total daily zinc intake — account for when combining with other zinc-containing supplements',
      'May enhance effects of proton pump inhibitors for gastric healing',
      'Separate from iron supplements by 2 hours',
    ],
    time_to_benefit: '4-8 weeks for gastric symptom improvement, 8-12 weeks for mucosal healing',
    cost_monthly: '$25-40',
    quality_note: 'PepZin GI is the clinically studied branded form. Ensure the product contains the actual zinc carnosine chelate complex, not a simple blend of zinc and L-carnosine.',
  },

  curcumin_piperine: {
    name: 'Curcumin with Piperine',
    category: 'anti_inflammatory',
    evidence_rating: 4,
    primary_uses: ['anti_inflammatory', 'ibd_support', 'joint_pain', 'cardiovascular', 'antioxidant'],
    dose_standard: '1000-2000mg daily',
    timing: 'with_meals',
    timing_notes:
      'Take with meals containing fat for enhanced absorption. Piperine (black pepper extract) increases curcumin bioavailability by 2000%. Split into 2 doses for sustained anti-inflammatory effect. Some enhanced bioavailability formulations (Meriva, Longvida, CurcuWIN) may not require piperine. Allow 6-8 weeks for full anti-inflammatory benefit.',
    form_matters: true,
    best_form: 'Curcumin standardized to 95% curcuminoids with piperine/BioPerine, or enhanced bioavailability form (Meriva phospholipid complex, Longvida, or CurcuWIN)',
    ibd_specific:
      'Multiple randomized controlled trials demonstrate curcumin as effective adjunctive therapy for maintaining remission in ulcerative colitis. A landmark RCT showed curcumin 2g/day plus mesalamine significantly reduced relapse rates vs mesalamine alone. May allow mesalamine dose reduction in some patients under medical supervision.',
    drug_interactions: [
      'May potentiate anticoagulants and antiplatelet agents — monitor for bleeding',
      'Inhibits CYP3A4, CYP1A2, and CYP2D6 — may increase levels of drugs metabolized by these enzymes',
      'May enhance effects of diabetes medications — monitor blood sugar',
      'Piperine component increases bioavailability of many drugs — review all concurrent medications',
      'May interfere with iron absorption — separate from iron supplements by 2 hours',
    ],
    contraindications: [
      'Active gallbladder disease or bile duct obstruction',
      'Scheduled surgery within 2 weeks — discontinue due to antiplatelet effect',
    ],
    time_to_benefit: '4-6 weeks for anti-inflammatory benefit, 8-12 weeks for IBD adjunctive effect',
    cost_monthly: '$20-35',
  },

  nac: {
    name: 'NAC (N-Acetyl Cysteine)',
    category: 'antioxidants',
    evidence_rating: 4,
    primary_uses: ['liver_support', 'antioxidant', 'respiratory_health', 'mental_health', 'detoxification'],
    dose_standard: '600mg twice daily',
    timing: 'with_meals',
    timing_notes:
      'Take with meals to reduce GI side effects (nausea is the most common complaint). Split dosing maintains more consistent glutathione levels throughout the day. Can be taken on empty stomach if tolerated. Morning and evening dosing recommended.',
    form_matters: false,
    liver_specific:
      'NAC is the direct precursor to glutathione, the body\'s master antioxidant and primary hepatic detoxification molecule. It replenishes intracellular glutathione stores depleted by medication metabolism, alcohol, acetaminophen, environmental toxins, and oxidative stress. NAC is the FDA-approved antidote for acetaminophen overdose specifically because of its glutathione-restoring capacity. Particularly important for patients on hepatotoxic medications or with fatty liver disease.',
    drug_interactions: [
      'May potentiate the effects of nitroglycerin and nitrate medications — risk of hypotension and headache',
      'Enhances acetaminophen detoxification — protective but consult provider if on regular acetaminophen',
      'May interact with activated charcoal — separate by 2 hours',
      'Theoretical interaction with immunosuppressants due to immune-modulating properties',
    ],
    time_to_benefit: '2-4 weeks for respiratory benefit, 4-8 weeks for liver and antioxidant effects',
    cost_monthly: '$15-25',
  },

  saw_palmetto: {
    name: 'Saw Palmetto',
    category: 'dht_blocker',
    evidence_rating: 3,
    primary_uses: ['hair_loss', 'prostate_health', 'dht_reduction', 'hormonal_balance'],
    dose_standard: '320mg daily',
    timing: 'with_meals',
    timing_notes:
      'Take with a fat-containing meal for optimal absorption of lipophilic active compounds. Consistent daily dosing is essential — effects are cumulative and require months of continuous use. Some practitioners recommend splitting to 160mg twice daily for prostate indications.',
    form_matters: true,
    best_form: 'CO2 supercritical extract standardized to 85-95% fatty acids and sterols',
    mechanism:
      'Inhibits 5-alpha reductase types I and II, reducing conversion of testosterone to dihydrotestosterone (DHT). DHT is the primary androgen responsible for androgenetic alopecia and benign prostatic hyperplasia. Unlike finasteride, saw palmetto provides partial 5-AR inhibition with significantly fewer sexual side effects. Also has anti-inflammatory and anti-androgenic properties at the receptor level.',
    drug_interactions: [
      'May potentiate effects of finasteride or dutasteride — additive DHT reduction',
      'Theoretical antiplatelet effect — use caution with anticoagulants',
      'May affect oral contraceptive or hormone replacement therapy efficacy',
      'May interfere with PSA testing — inform urologist of use',
    ],
    contraindications: [
      'Pregnancy — absolutely contraindicated due to anti-androgenic effects on fetal development',
      'Women of childbearing age without reliable contraception',
    ],
    time_to_benefit: '3-6 months for hair loss, 4-6 weeks for prostate symptom improvement',
    cost_monthly: '$15-25',
  },

  plant_sterols: {
    name: 'Plant Sterols / Stanols',
    category: 'cardiovascular',
    evidence_rating: 5,
    primary_uses: ['cholesterol_reduction', 'cardiovascular_protection', 'ldl_lowering'],
    dose_standard: '2g daily with meals',
    timing: 'split_with_meals',
    timing_notes:
      'Split across 2-3 meals for maximum cholesterol absorption inhibition — plant sterols must be present in the GI tract at the same time as dietary cholesterol. Taking the full dose at one meal provides less benefit than divided dosing. Can be obtained through fortified foods or supplements. Consistent daily intake is required for sustained LDL reduction.',
    form_matters: false,
    mechanism:
      'Plant sterols and stanols are structurally similar to cholesterol and compete for absorption at intestinal brush border membrane transporters (NPC1L1). They displace cholesterol from mixed micelles in the intestinal lumen, reducing cholesterol absorption by approximately 30-50%. This results in a 6-15% reduction in LDL-C. The effect is additive to statin therapy. FDA-approved health claim for cardiovascular risk reduction at 2g daily intake.',
    drug_interactions: [
      'Additive LDL-lowering effect with statins — beneficial combination',
      'May reduce absorption of fat-soluble vitamins (A, D, E, K) with long-term use — consider supplementation',
      'May reduce absorption of carotenoids including beta-carotene and lycopene',
      'Ezetimibe and plant sterols both target intestinal cholesterol absorption — combination may have diminishing returns',
    ],
    time_to_benefit: '2-4 weeks for measurable LDL-C reduction',
    cost_monthly: '$20-30',
    quality_note: 'Look for products providing 2g total plant sterols/stanols per daily serving. Stanols may have slight advantage over sterols as they are less absorbed systemically.',
  },

  // ─── VITAMINS ───────────────────────────────────────────────────────

  vitamin_a: {
    name: 'Vitamin A (Retinol / Beta-Carotene)',
    category: 'vitamins',
    evidence_rating: 4,
    primary_uses: ['immune_support', 'vision', 'skin_health', 'gut_lining_repair', 'reproduction'],
    dose_standard: '3000-5000 IU retinol or 10,000 IU beta-carotene',
    timing: 'with_meals',
    timing_notes:
      'Take with a fat-containing meal as vitamin A is fat-soluble. Preformed retinol is immediately bioavailable. Beta-carotene requires conversion and is safer for long-term use. Do not exceed 10,000 IU preformed retinol daily to avoid toxicity.',
    form_matters: true,
    best_form: 'Retinyl palmitate for therapeutic use, mixed carotenoids for general antioxidant support. Beta-carotene is safer for long-term supplementation.',
    drug_interactions: [
      'Retinoids (isotretinoin, acitretin) — additive toxicity risk, do not combine',
      'Warfarin — high-dose vitamin A may potentiate anticoagulant effect',
      'Orlistat and cholestyramine reduce absorption — separate by 2 hours',
      'Tetracycline antibiotics — concurrent high-dose vitamin A increases risk of intracranial hypertension',
    ],
    contraindications: [
      'Pregnancy — preformed retinol above 10,000 IU daily is teratogenic',
      'Liver disease — risk of hepatotoxicity with preformed retinol',
    ],
    time_to_benefit: '2-4 weeks for immune benefit, 4-8 weeks for skin improvement',
    cost_monthly: '$8-15',
  },

  vitamin_c: {
    name: 'Vitamin C (Ascorbic Acid)',
    category: 'vitamins',
    evidence_rating: 4,
    primary_uses: ['immune_support', 'collagen_synthesis', 'antioxidant', 'iron_absorption', 'wound_healing'],
    dose_standard: '500-1000mg daily, split doses',
    timing: 'with_meals',
    timing_notes:
      'Split into 2-3 doses throughout the day for optimal plasma levels — absorption efficiency drops significantly above 500mg per dose. Take with iron-rich meals to enhance non-heme iron absorption by up to 6-fold. Buffered forms (calcium ascorbate, sodium ascorbate) are gentler on the stomach.',
    form_matters: false,
    mechanism:
      'Essential cofactor for collagen synthesis, carnitine production, and neurotransmitter synthesis. Potent water-soluble antioxidant that regenerates vitamin E. Enhances non-heme iron absorption by reducing ferric to ferrous iron in the gut.',
    drug_interactions: [
      'Enhances non-heme iron absorption — beneficial for iron deficiency, but monitor in hemochromatosis',
      'May reduce efficacy of some chemotherapy agents — consult oncologist',
      'High doses may interfere with blood glucose meter readings',
      'May increase aluminum absorption from antacids — separate by 2 hours',
    ],
    time_to_benefit: '1-2 weeks for immune support, 4-8 weeks for collagen and skin effects',
    cost_monthly: '$8-15',
  },

  vitamin_e: {
    name: 'Vitamin E (Mixed Tocopherols)',
    category: 'vitamins',
    evidence_rating: 3,
    primary_uses: ['antioxidant', 'skin_health', 'cardiovascular', 'immune_support', 'neuroprotection'],
    dose_standard: '200-400 IU daily',
    timing: 'with_meals',
    timing_notes:
      'Take with a fat-containing meal for absorption. Use mixed tocopherols rather than isolated alpha-tocopherol, which can deplete gamma-tocopherol. Do not exceed 400 IU daily long-term — meta-analyses suggest higher doses may increase all-cause mortality.',
    form_matters: true,
    best_form: 'Mixed tocopherols (d-alpha, d-beta, d-gamma, d-delta) — avoid synthetic dl-alpha-tocopherol which has half the bioactivity',
    drug_interactions: [
      'Potentiates anticoagulants (warfarin, aspirin, clopidogrel) — increased bleeding risk',
      'May reduce efficacy of statin/niacin combinations for HDL raising',
      'Orlistat and cholestyramine reduce absorption',
      'High doses may interfere with vitamin K-dependent clotting — discontinue 2 weeks before surgery',
    ],
    contraindications: [
      'Bleeding disorders or active anticoagulant therapy without monitoring',
      'Scheduled surgery within 2 weeks',
    ],
    time_to_benefit: '4-8 weeks for antioxidant benefit, 8-12 weeks for skin and cardiovascular effects',
    cost_monthly: '$12-20',
  },

  vitamin_k2_mk7: {
    name: 'Vitamin K2 (MK-7)',
    category: 'vitamins',
    evidence_rating: 4,
    primary_uses: ['bone_health', 'calcium_metabolism', 'cardiovascular', 'dental_health'],
    dose_standard: '100-200mcg daily',
    timing: 'morning_with_fat',
    timing_notes:
      'Take with a fat-containing meal for absorption. MK-7 has a long half-life (72 hours) allowing once-daily dosing. Pairs synergistically with vitamin D3 — K2 activates osteocalcin and matrix GLA protein to direct calcium into bones and away from arterial walls.',
    form_matters: true,
    best_form: 'MK-7 (menaquinone-7) from natto fermentation — longer half-life and more consistent blood levels than MK-4',
    mechanism:
      'Activates vitamin K-dependent proteins including osteocalcin (bone mineralization) and matrix GLA protein (prevents arterial calcification). Essential partner with vitamin D3 — without adequate K2, vitamin D-enhanced calcium absorption may deposit in soft tissues rather than bone.',
    drug_interactions: [
      'Warfarin and other vitamin K antagonists — K2 directly opposes warfarin mechanism. Do NOT supplement without prescriber guidance',
      'May affect INR in patients on anticoagulants — monitor closely',
      'Antibiotics can deplete gut bacteria that produce K2',
      'Orlistat and cholestyramine reduce absorption',
    ],
    contraindications: [
      'Warfarin therapy without direct medical supervision and INR monitoring',
    ],
    time_to_benefit: '4-8 weeks for biomarker changes, 6-12 months for bone density improvement',
    cost_monthly: '$12-20',
  },

  thiamine_b1: {
    name: 'Thiamine (Vitamin B1)',
    category: 'b_vitamins',
    evidence_rating: 4,
    primary_uses: ['energy', 'nerve_function', 'alcohol_recovery', 'cardiovascular', 'blood_sugar'],
    dose_standard: '100-300mg daily (benfotiamine 150-300mg)',
    timing: 'morning',
    timing_notes:
      'Take in the morning with or without food. Water-soluble so excess is excreted. Benfotiamine (fat-soluble form) has 5x greater bioavailability and preferentially targets peripheral nerves. Critical supplement for anyone with history of alcohol use, diabetes, or bariatric surgery.',
    form_matters: true,
    best_form: 'Benfotiamine for neuropathy and blood sugar support. Standard thiamine HCl for general use.',
    specific_for: 'Alcohol recovery, diabetic neuropathy, Wernicke encephalopathy prevention',
    drug_interactions: [
      'Loop diuretics (furosemide) increase thiamine excretion — supplementation recommended',
      'Metformin may reduce thiamine levels',
      'Generally very safe with minimal drug interactions',
      '5-FU chemotherapy depletes thiamine',
    ],
    time_to_benefit: '1-2 weeks for energy, 4-12 weeks for neuropathy improvement',
    cost_monthly: '$8-15',
  },

  riboflavin_b2: {
    name: 'Riboflavin (Vitamin B2)',
    category: 'b_vitamins',
    evidence_rating: 4,
    primary_uses: ['migraine_prevention', 'energy', 'antioxidant', 'mitochondrial_support'],
    dose_standard: '25-50mg general, 400mg for migraine prevention',
    timing: 'morning',
    timing_notes:
      'Take in the morning with food. For migraine prevention, 400mg daily is the clinically studied dose — this is well above the RDA but has strong evidence from multiple RCTs. Will cause bright yellow-green urine, which is harmless. Absorption is saturable, so split high doses into 2 servings.',
    form_matters: false,
    mechanism:
      'Essential cofactor for FAD and FMN, required for mitochondrial electron transport chain function. At high doses (400mg), improves mitochondrial energy metabolism in neurons, which is thought to underlie its migraine-preventive effect. Also required for regeneration of glutathione.',
    drug_interactions: [
      'Tricyclic antidepressants and phenothiazines may reduce riboflavin absorption',
      'Probenecid reduces riboflavin absorption',
      'Doxorubicin may deplete riboflavin',
      'Generally very safe — no significant drug interactions at standard doses',
    ],
    time_to_benefit: '1-2 weeks for energy, 8-12 weeks for migraine frequency reduction',
    cost_monthly: '$8-15',
  },

  niacin_b3: {
    name: 'Niacin (Vitamin B3)',
    category: 'b_vitamins',
    evidence_rating: 4,
    primary_uses: ['cholesterol_management', 'energy', 'skin_health', 'circulation', 'mental_health'],
    dose_standard: '500-1000mg for cholesterol (immediate-release or extended-release)',
    timing: 'with_meals',
    timing_notes:
      'Take with food and consider 325mg aspirin 30 minutes before to minimize flushing. Start low (100mg) and titrate up over weeks. Immediate-release causes more flushing but less hepatotoxicity. Extended-release reduces flushing but requires liver monitoring. "No-flush" niacinamide does NOT improve lipids. Take at bedtime if using for cholesterol.',
    form_matters: true,
    best_form: 'Immediate-release nicotinic acid for lipids. Niacinamide (no-flush) only for skin and general B3 status — it does not affect cholesterol.',
    note: 'Flush-free niacinamide is a different compound that does not raise HDL or lower triglycerides. For cholesterol benefits, actual nicotinic acid is required.',
    drug_interactions: [
      'Statins — combination increases myopathy risk, especially with sustained-release niacin',
      'May potentiate blood pressure medications — additive hypotensive effect',
      'May worsen blood sugar control in diabetics — monitor glucose',
      'Alcohol increases flushing and hepatotoxicity risk',
    ],
    contraindications: [
      'Active liver disease or unexplained elevated liver enzymes',
      'Active peptic ulcer disease',
      'Gout — niacin raises uric acid levels',
    ],
    time_to_benefit: '2-4 weeks for HDL improvement, 4-8 weeks for triglyceride reduction',
    cost_monthly: '$10-20',
  },

  pantothenic_acid_b5: {
    name: 'Pantothenic Acid (Vitamin B5)',
    category: 'b_vitamins',
    evidence_rating: 2,
    primary_uses: ['adrenal_support', 'energy', 'wound_healing', 'acne', 'stress_resilience'],
    dose_standard: '250-500mg daily',
    timing: 'morning',
    timing_notes:
      'Take in the morning with or without food. Water-soluble with good absorption. Often included in B-complex formulations. Pantethine form (300mg three times daily) has specific evidence for cholesterol reduction. High doses (5-10g) used historically for acne but evidence is weak.',
    form_matters: false,
    mechanism:
      'Precursor to coenzyme A (CoA), essential for fatty acid synthesis, energy metabolism, and adrenal steroid hormone production. Involved in over 70 enzymatic pathways. Pantethine form may lower total cholesterol and triglycerides modestly.',
    drug_interactions: [
      'Generally very safe with no significant drug interactions',
      'May enhance effects of cholinesterase inhibitors (Alzheimer medications)',
      'Antibiotics may reduce gut bacterial synthesis of B5',
    ],
    time_to_benefit: '2-4 weeks for energy, 8-12 weeks for pantethine lipid effects',
    cost_monthly: '$8-12',
  },

  pyridoxine_b6: {
    name: 'Vitamin B6 (P-5-P)',
    category: 'b_vitamins',
    evidence_rating: 4,
    primary_uses: ['neurotransmitter_synthesis', 'pms_relief', 'carpal_tunnel', 'homocysteine', 'morning_sickness'],
    dose_standard: '25-50mg P-5-P daily (max 100mg total B6)',
    timing: 'morning',
    timing_notes:
      'Take in the morning as B6 is involved in neurotransmitter synthesis and may affect dreams if taken at bedtime. P-5-P (pyridoxal-5-phosphate) is the active coenzyme form that bypasses hepatic conversion. Do NOT exceed 100mg daily long-term — chronic high-dose B6 causes peripheral neuropathy.',
    form_matters: true,
    best_form: 'Pyridoxal-5-phosphate (P-5-P) — the active coenzyme form. Standard pyridoxine HCl requires liver conversion.',
    drug_interactions: [
      'Levodopa (without carbidopa) — B6 accelerates peripheral conversion of levodopa, reducing efficacy. Safe with carbidopa/levodopa combination',
      'Phenobarbital and phenytoin — B6 may reduce anticonvulsant levels',
      'Isoniazid depletes B6 — supplementation is standard of care',
      'Oral contraceptives deplete B6',
    ],
    contraindications: [
      'Do not exceed 100mg daily — doses above 200mg/day for extended periods cause sensory neuropathy',
    ],
    time_to_benefit: '2-4 weeks for PMS and mood, 4-8 weeks for carpal tunnel symptoms',
    cost_monthly: '$8-15',
  },

  biotin_b7: {
    name: 'Biotin (Vitamin B7)',
    category: 'b_vitamins',
    evidence_rating: 3,
    primary_uses: ['hair_health', 'nail_strength', 'skin_health', 'blood_sugar'],
    dose_standard: '2500-5000mcg daily',
    timing: 'morning',
    timing_notes:
      'Take in the morning with or without food. Effects on hair and nails require months of consistent use. Most dramatic results in those with actual biotin deficiency (which is more common than assumed, especially with raw egg white consumption, anticonvulsant use, or pregnancy).',
    form_matters: false,
    note: 'CRITICAL LAB INTERFERENCE: High-dose biotin causes false results on many immunoassays including troponin, thyroid panels (TSH, T4), and hormone tests. Discontinue biotin 48-72 hours before any blood work.',
    drug_interactions: [
      'CRITICAL: Interferes with streptavidin-biotin immunoassays — can cause false thyroid results, false troponin, false hormone levels. Stop 48-72 hours before labs',
      'Anticonvulsants (carbamazepine, phenytoin, phenobarbital) deplete biotin',
      'Long-term antibiotic use may reduce gut bacterial biotin synthesis',
      'Raw egg whites contain avidin which binds and inactivates biotin',
    ],
    time_to_benefit: '3-6 months for hair and nail improvement, 4-8 weeks for blood sugar effects',
    cost_monthly: '$8-12',
  },

  folate_food: {
    name: 'Folinic Acid (5-Formyl-THF)',
    category: 'b_vitamins',
    evidence_rating: 4,
    primary_uses: ['methylation_support', 'homocysteine', 'mood', 'neural_tube_defect_prevention', 'mthfr'],
    dose_standard: '400-800mcg daily',
    timing: 'morning',
    timing_notes:
      'Take in the morning. Folinic acid is an alternative active folate for individuals who experience overmethylation symptoms (anxiety, irritability, insomnia) from methylfolate. It enters the folate cycle at a different point and does not directly donate methyl groups. Like methylfolate, it bypasses the MTHFR enzyme and is effective for those with MTHFR variants.',
    form_matters: true,
    best_form: 'Calcium folinate (folinic acid / 5-formyl-THF). An alternative to methylfolate for those who are sensitive to methyl donors.',
    specific_for: 'Patients with MTHFR polymorphisms who cannot tolerate methylfolate, or who experience overmethylation symptoms',
    drug_interactions: [
      'Methotrexate — folinic acid (leucovorin) is used as rescue therapy, but timing must be precise',
      'Phenytoin and carbamazepine deplete folate',
      'Sulfasalazine and mesalamine inhibit folate absorption',
      'May enhance SSRI efficacy as adjunctive therapy',
    ],
    time_to_benefit: '2-4 weeks for mood, 4-8 weeks for homocysteine reduction',
    cost_monthly: '$12-20',
  },

  inositol: {
    name: 'Inositol (Myo-Inositol)',
    category: 'vitamins',
    evidence_rating: 4,
    primary_uses: ['pcos', 'anxiety', 'insulin_sensitivity', 'sleep', 'ocd', 'fertility'],
    dose_standard: '2-4g daily for anxiety/sleep, 4g myo + 0.1g D-chiro for PCOS',
    timing: 'split_doses',
    timing_notes:
      'Split into 2 doses — morning and evening. For PCOS, the 40:1 ratio of myo-inositol to D-chiro-inositol mirrors physiological ratios. For anxiety and OCD, higher doses (12-18g) have been studied but cause GI side effects. Powder form is most practical at therapeutic doses. Take on empty stomach for best absorption.',
    form_matters: true,
    best_form: 'Myo-inositol for general use. 40:1 myo-inositol to D-chiro-inositol ratio for PCOS.',
    mechanism:
      'Second messenger in insulin signaling pathways — improves insulin receptor sensitivity. In the ovary, restores FSH signaling to improve ovulation. Also a precursor to phosphatidylinositol, critical for serotonin and dopamine receptor function, explaining anxiolytic effects.',
    drug_interactions: [
      'May enhance effects of diabetes medications — monitor blood sugar',
      'May enhance lithium efficacy — monitor lithium levels',
      'May have additive effects with SSRIs for anxiety and OCD',
      'Generally very safe with minimal drug interactions',
    ],
    time_to_benefit: '2-4 weeks for anxiety and sleep, 3-6 months for PCOS hormonal improvement and ovulation',
    cost_monthly: '$15-25',
  },

  // ─── MINERALS ───────────────────────────────────────────────────────

  calcium_citrate: {
    name: 'Calcium Citrate',
    category: 'minerals',
    evidence_rating: 4,
    primary_uses: ['bone_health', 'muscle_function', 'nerve_function', 'osteoporosis_prevention'],
    dose_standard: '500-600mg daily, split doses',
    timing: 'split_with_meals',
    timing_notes:
      'Split into 2 doses of 250-300mg — calcium absorption maxes out at ~500mg per dose. Citrate form can be taken with or without food (unlike carbonate which requires stomach acid). Separate from iron, zinc, magnesium, and thyroid medications by 2 hours. Must pair with vitamin D3 and K2 for proper utilization.',
    form_matters: true,
    best_form: 'Calcium citrate — better absorbed than carbonate, especially in those with low stomach acid, PPI users, or elderly. Avoid calcium carbonate if on PPIs.',
    note: 'Total calcium (diet + supplements) should not exceed 1000-1200mg daily. Excess calcium without adequate K2 may contribute to arterial calcification. Food-first approach preferred.',
    drug_interactions: [
      'Reduces absorption of levothyroxine — separate by 4 hours',
      'Reduces absorption of tetracycline and fluoroquinolone antibiotics — separate by 2-4 hours',
      'Thiazide diuretics reduce calcium excretion — risk of hypercalcemia',
      'Reduces absorption of bisphosphonates — separate by at least 30 minutes',
      'Competes with iron, zinc, and magnesium for absorption — separate by 2 hours',
    ],
    contraindications: [
      'Hypercalcemia or hyperparathyroidism',
      'History of calcium kidney stones (consult physician)',
    ],
    time_to_benefit: '6-12 months for bone density improvement when combined with D3 and K2',
    cost_monthly: '$8-15',
  },

  chromium_picolinate: {
    name: 'Chromium Picolinate',
    category: 'minerals',
    evidence_rating: 3,
    primary_uses: ['blood_sugar', 'insulin_sensitivity', 'cravings', 'pcos', 'weight_management'],
    dose_standard: '200-1000mcg daily',
    timing: 'with_meals',
    timing_notes:
      'Take with meals, especially carbohydrate-containing meals to support glucose disposal. Split into 2-3 doses with meals for best effect on blood sugar. Effects are most pronounced in those with demonstrated chromium deficiency or insulin resistance.',
    form_matters: true,
    best_form: 'Chromium picolinate or chromium polynicotinate — both well-absorbed. Avoid chromium chloride.',
    drug_interactions: [
      'May potentiate diabetes medications (insulin, metformin, sulfonylureas) — monitor blood sugar for hypoglycemia',
      'NSAIDs may increase chromium absorption',
      'Antacids and PPIs may reduce chromium absorption',
      'Beta-blockers and corticosteroids may increase chromium excretion',
    ],
    time_to_benefit: '4-8 weeks for blood sugar improvement, 8-12 weeks for cravings reduction',
    cost_monthly: '$8-12',
  },

  selenium: {
    name: 'Selenium',
    category: 'minerals',
    evidence_rating: 4,
    primary_uses: ['thyroid_support', 'immune_support', 'antioxidant', 'autoimmune_thyroid', 'fertility'],
    dose_standard: '200mcg daily',
    timing: 'morning',
    timing_notes:
      'Take in the morning with or without food. Do not exceed 400mcg daily from all sources — selenosis (toxicity) causes hair loss, nail brittleness, and garlic breath. Particularly important for thyroid function as the thyroid contains more selenium per gram than any other organ. Brazil nuts contain variable and potentially excessive selenium — supplementation provides more consistent dosing.',
    form_matters: true,
    best_form: 'Selenomethionine for general use, sodium selenite for specific antioxidant (glutathione peroxidase) support',
    mechanism:
      'Essential cofactor for glutathione peroxidase (antioxidant defense), thioredoxin reductase, and iodothyronine deiodinases (T4 to T3 thyroid hormone conversion). In Hashimoto thyroiditis, 200mcg selenium reduces TPO antibodies by 20-40% in multiple RCTs.',
    drug_interactions: [
      'May interact with anticoagulants — theoretical increased bleeding risk',
      'Statins may have reduced efficacy of HDL-raising when combined with selenium + vitamin E',
      'May reduce cisplatin toxicity — consult oncologist',
      'Gold compounds used in rheumatoid arthritis may reduce selenium levels',
    ],
    time_to_benefit: '4-8 weeks for thyroid antibody reduction, 8-12 weeks for immune benefit',
    cost_monthly: '$8-12',
  },

  iodine: {
    name: 'Iodine',
    category: 'minerals',
    evidence_rating: 4,
    primary_uses: ['thyroid_support', 'thyroid_hormone_production', 'breast_health', 'cognitive_development'],
    dose_standard: '150-300mcg daily (RDA 150mcg)',
    timing: 'morning',
    timing_notes:
      'Take in the morning. Start LOW (150mcg) and increase gradually — excess iodine can trigger or worsen autoimmune thyroiditis (Hashimoto) and cause thyroid dysfunction. Those with existing Hashimoto should consult their endocrinologist before supplementing. Selenium supplementation alongside iodine is protective against autoimmune thyroid flares.',
    form_matters: true,
    best_form: 'Potassium iodide for consistent dosing. Kelp-based supplements have highly variable iodine content and are not recommended.',
    drug_interactions: [
      'Lithium — concurrent iodine increases risk of hypothyroidism',
      'Amiodarone contains high iodine — additional supplementation may cause thyroid toxicity',
      'Antithyroid medications (methimazole, PTU) — iodine affects thyroid hormone synthesis',
      'ACE inhibitors and potassium-sparing diuretics — potassium iodide adds to potassium load',
    ],
    contraindications: [
      'Hashimoto thyroiditis — use only under medical supervision',
      'Hyperthyroidism or Graves disease',
      'Dermatitis herpetiformis — iodine triggers flares',
    ],
    time_to_benefit: '4-8 weeks for thyroid function optimization',
    cost_monthly: '$6-10',
  },

  boron: {
    name: 'Boron',
    category: 'minerals',
    evidence_rating: 3,
    primary_uses: ['bone_health', 'testosterone_support', 'vitamin_d_metabolism', 'joint_health', 'cognitive'],
    dose_standard: '3-6mg daily',
    timing: 'morning',
    timing_notes:
      'Take in the morning with food. Boron enhances vitamin D metabolism and may increase free testosterone by reducing SHBG. Supports calcium and magnesium utilization for bone health. Well-tolerated at recommended doses. Upper limit is 20mg daily.',
    form_matters: false,
    mechanism:
      'Influences metabolism of steroid hormones (increases free testosterone, supports estrogen in postmenopausal women), enhances vitamin D hydroxylation, reduces inflammatory biomarkers (CRP, TNF-alpha), and supports bone mineralization by reducing urinary calcium and magnesium excretion.',
    drug_interactions: [
      'May affect estrogen and testosterone levels — use caution with hormone replacement therapy',
      'May enhance effects of vitamin D supplementation',
      'Generally very safe with minimal drug interactions',
    ],
    time_to_benefit: '2-4 weeks for hormonal effects, 3-6 months for bone and joint benefit',
    cost_monthly: '$6-10',
  },

  manganese: {
    name: 'Manganese',
    category: 'minerals',
    evidence_rating: 3,
    primary_uses: ['bone_health', 'antioxidant', 'blood_sugar', 'connective_tissue', 'wound_healing'],
    dose_standard: '2-5mg daily',
    timing: 'with_meals',
    timing_notes:
      'Take with food. Do not exceed 11mg daily (upper limit). Separate from calcium, iron, and zinc supplements by 2 hours as they compete for absorption. Deficiency is rare but may occur with long-term parenteral nutrition or high calcium/iron intake.',
    form_matters: false,
    mechanism:
      'Cofactor for manganese superoxide dismutase (MnSOD), a critical mitochondrial antioxidant enzyme. Also required for bone matrix formation (glycosyltransferases), gluconeogenesis (pyruvate carboxylase), and cartilage proteoglycan synthesis.',
    drug_interactions: [
      'Antacids and PPIs may reduce manganese absorption',
      'High iron, calcium, or zinc intake reduces manganese absorption',
      'Tetracycline and fluoroquinolone antibiotics — separate by 2 hours',
      'May accumulate in liver disease — avoid supplementation without monitoring',
    ],
    contraindications: [
      'Liver disease — manganese is hepatically cleared and may accumulate causing neurotoxicity',
    ],
    time_to_benefit: '4-8 weeks for antioxidant benefit',
    cost_monthly: '$6-10',
  },

  molybdenum: {
    name: 'Molybdenum',
    category: 'minerals',
    evidence_rating: 2,
    primary_uses: ['detoxification', 'sulfite_sensitivity', 'aldehyde_detox', 'uric_acid_metabolism'],
    dose_standard: '75-250mcg daily',
    timing: 'morning',
    timing_notes:
      'Take in the morning with or without food. Particularly useful for individuals with sulfite sensitivity (headaches, flushing, or asthma from wine, dried fruit, or preservatives). Molybdenum is the cofactor for sulfite oxidase which converts toxic sulfites to sulfates. Upper limit is 2mg daily.',
    form_matters: false,
    mechanism:
      'Essential cofactor for three enzymes: sulfite oxidase (detoxifies sulfites), xanthine oxidase (purine metabolism), and aldehyde oxidase (detoxifies aldehydes including acetaldehyde from alcohol metabolism).',
    specific_for: 'Sulfite-sensitive individuals, those with poor aldehyde detoxification, candida protocols',
    drug_interactions: [
      'High doses may increase uric acid via xanthine oxidase activation — caution in gout',
      'High copper intake antagonizes molybdenum and vice versa',
      'Generally very safe with minimal drug interactions at standard doses',
    ],
    time_to_benefit: '1-2 weeks for sulfite sensitivity improvement',
    cost_monthly: '$6-10',
  },

  copper: {
    name: 'Copper (Bisglycinate)',
    category: 'minerals',
    evidence_rating: 3,
    primary_uses: ['iron_metabolism', 'collagen_synthesis', 'immune_support', 'antioxidant', 'nerve_health'],
    dose_standard: '1-2mg daily',
    timing: 'with_meals',
    timing_notes:
      'Take with food, separate from zinc by 2 hours. Copper supplementation is primarily needed when taking zinc above 30mg daily long-term, as zinc induces metallothionein which traps copper and causes depletion. Standard ratio is 15:1 zinc to copper. Do not supplement copper without confirmed need — excess copper is associated with oxidative damage.',
    form_matters: true,
    best_form: 'Copper bisglycinate (chelated) for best absorption and tolerability. Avoid copper oxide which is poorly absorbed.',
    note: 'Most people get adequate copper from diet. Supplementation is primarily indicated to offset zinc-induced copper depletion or confirmed copper deficiency.',
    drug_interactions: [
      'Zinc supplements reduce copper absorption — the primary reason for copper supplementation',
      'Penicillamine and trientine (Wilson disease drugs) chelate copper — do not supplement',
      'Antacids and PPIs may reduce copper absorption',
      'High-dose vitamin C may reduce copper absorption',
    ],
    contraindications: [
      'Wilson disease — copper accumulation disorder',
      'Copper overload or elevated serum copper without deficiency',
    ],
    time_to_benefit: '4-8 weeks for repletion of copper stores',
    cost_monthly: '$6-10',
  },

  potassium: {
    name: 'Potassium (Citrate)',
    category: 'minerals',
    evidence_rating: 4,
    primary_uses: ['heart_health', 'muscle_function', 'blood_pressure', 'kidney_stone_prevention', 'electrolyte_balance'],
    dose_standard: '99-200mg supplement (dietary target 3500-4700mg total)',
    timing: 'with_meals',
    timing_notes:
      'Take with meals to reduce GI upset. OTC supplements are limited to 99mg per dose by FDA regulation due to cardiac risk of rapid potassium bolus. Dietary sources (avocado, banana, potato, leafy greens) should be the primary potassium strategy. Prescription potassium is available for documented deficiency. Citrate form is preferred for those prone to kidney stones.',
    form_matters: true,
    best_form: 'Potassium citrate preferred — also alkalinizes urine, reducing kidney stone risk. Potassium chloride for those needing chloride repletion.',
    note: 'Dietary approach is vastly preferred over supplementation. Increasing potassium-rich foods is safer and more effective than high-dose supplements.',
    drug_interactions: [
      'ACE inhibitors and ARBs increase potassium retention — risk of hyperkalemia',
      'Potassium-sparing diuretics (spironolactone, eplerenone) — additive hyperkalemia risk',
      'NSAIDs can increase potassium levels',
      'Trimethoprim increases potassium levels — monitor closely',
    ],
    contraindications: [
      'Kidney disease or impaired renal potassium excretion',
      'Concurrent use of multiple potassium-raising medications without monitoring',
      'Addison disease',
    ],
    time_to_benefit: '2-4 weeks for blood pressure improvement with adequate intake',
    cost_monthly: '$8-12',
  },

  iron_bisglycinate: {
    name: 'Iron Bisglycinate',
    category: 'minerals',
    evidence_rating: 5,
    primary_uses: ['iron_deficiency', 'anemia', 'fatigue', 'hair_loss', 'restless_legs'],
    dose_standard: '25-36mg elemental iron every other day',
    timing: 'empty_stomach_or_with_vitamin_c',
    timing_notes:
      'Take on empty stomach with vitamin C (200mg) for maximum absorption. If GI intolerant, take with a small meal (absorption decreases ~40%). Every-other-day dosing may be more effective than daily due to hepcidin regulation — daily dosing raises hepcidin which blocks next-day absorption. Do NOT supplement iron without confirmed deficiency (ferritin, serum iron, TIBC).',
    form_matters: true,
    best_form: 'Iron bisglycinate (chelated) — far less GI side effects than ferrous sulfate with comparable absorption. Avoid ferrous sulfate if possible.',
    specific_for: 'Confirmed iron deficiency (ferritin <30 ng/mL), iron-deficiency anemia, heavy menstrual periods',
    note: 'NEVER supplement iron without lab confirmation of deficiency. Iron overload causes oxidative damage to liver, heart, and pancreas. Recheck ferritin after 3 months. Target ferritin 50-100 ng/mL.',
    drug_interactions: [
      'Reduces absorption of levothyroxine — separate by 4 hours',
      'Reduces absorption of tetracycline, fluoroquinolone, and penicillamine — separate by 2 hours',
      'PPIs and H2 blockers reduce iron absorption — take iron at a different time',
      'Calcium, zinc, and magnesium compete for absorption — separate by 2 hours',
      'Vitamin C (200mg) enhances iron absorption by up to 6-fold',
    ],
    contraindications: [
      'Hemochromatosis or iron overload disorders',
      'Repeated blood transfusions without confirmed deficiency',
      'Do not supplement without lab-confirmed iron deficiency',
    ],
    time_to_benefit: '2-4 weeks for fatigue improvement, 8-12 weeks for anemia correction, 3-6 months for ferritin repletion',
    cost_monthly: '$10-18',
  },

  // ─── AMINO ACIDS ────────────────────────────────────────────────────

  l_theanine: {
    name: 'L-Theanine',
    category: 'amino_acids',
    evidence_rating: 4,
    primary_uses: ['calm_focus', 'anxiety', 'sleep', 'stress', 'cognitive_enhancement'],
    dose_standard: '100-200mg daily',
    timing: 'as_needed_or_bedtime',
    timing_notes:
      'Flexible timing based on goal. For calm focus, take 100-200mg with caffeine (reduces jitters while preserving alertness). For sleep, take 200mg 30-60 minutes before bed. For anxiety, 200mg as needed. Onset is fast (30-60 minutes). Can be used daily or as needed. No tolerance development reported.',
    form_matters: false,
    mechanism:
      'Crosses blood-brain barrier and increases alpha brain wave activity, promoting a state of calm alertness. Increases GABA, serotonin, and dopamine in the brain. Modulates glutamate signaling. Uniquely promotes relaxation without sedation.',
    drug_interactions: [
      'May potentiate effects of blood pressure medications — additive hypotensive effect',
      'May enhance effects of sedatives and anxiolytics — use lower doses if combining',
      'Generally very safe with minimal drug interactions',
      'Safe to combine with caffeine — this is the most studied combination',
    ],
    time_to_benefit: '30-60 minutes for acute effect, 2-4 weeks for sustained anxiety reduction',
    cost_monthly: '$12-20',
  },

  l_tyrosine: {
    name: 'L-Tyrosine',
    category: 'amino_acids',
    evidence_rating: 3,
    primary_uses: ['dopamine_support', 'thyroid_support', 'stress_resilience', 'focus', 'cold_stress'],
    dose_standard: '500-2000mg daily',
    timing: 'morning_empty_stomach',
    timing_notes:
      'Take on empty stomach in the morning — competes with other large neutral amino acids for brain uptake. Best used situationally for periods of acute stress, sleep deprivation, or intense cognitive demand rather than daily. Military research shows benefit under cold, altitude, and sleep-deprivation stress. Do not use daily long-term without breaks.',
    form_matters: true,
    best_form: 'N-Acetyl L-Tyrosine (NALT) is more soluble but may be less effective for raising brain tyrosine than plain L-tyrosine',
    mechanism:
      'Precursor to dopamine, norepinephrine, epinephrine, and thyroid hormones. Under stress, catecholamine synthesis increases and tyrosine stores are depleted — supplementation maintains neurotransmitter production under demanding conditions.',
    drug_interactions: [
      'MAO inhibitors — risk of hypertensive crisis. Absolutely contraindicated',
      'Levodopa — tyrosine competes for absorption and may reduce levodopa efficacy',
      'Thyroid medications — tyrosine is a precursor to thyroid hormones, may affect dosing',
      'Stimulant medications — additive catecholamine effect',
    ],
    contraindications: [
      'MAO inhibitor use — risk of hypertensive crisis',
      'Hyperthyroidism',
      'Melanoma — tyrosine is a melanin precursor',
    ],
    time_to_benefit: '30-60 minutes for acute cognitive benefit',
    cost_monthly: '$12-18',
  },

  l_tryptophan: {
    name: 'L-Tryptophan',
    category: 'amino_acids',
    evidence_rating: 3,
    primary_uses: ['sleep', 'mood', 'serotonin_support', 'anxiety', 'pain_modulation'],
    dose_standard: '500-1000mg at bedtime',
    timing: 'bedtime',
    timing_notes:
      'Take 30-60 minutes before bedtime on an empty stomach or with a small carbohydrate snack (carbs trigger insulin which clears competing amino acids from blood, enhancing tryptophan brain uptake). Avoid taking with high-protein meals which contain competing amino acids. More gradual serotonin production than 5-HTP, with potentially fewer side effects.',
    form_matters: false,
    mechanism:
      'Essential amino acid and sole precursor to serotonin (via 5-HTP) and melatonin. Unlike 5-HTP, tryptophan enters the kynurenine pathway as well, supporting NAD+ production and immune regulation. Slower serotonin conversion than 5-HTP, providing a gentler effect.',
    drug_interactions: [
      'SSRIs, SNRIs, MAO inhibitors — risk of serotonin syndrome. Use only under medical supervision',
      'Triptans (migraine medications) — additive serotonin effect',
      'Tramadol — increased serotonin syndrome risk',
      'Do not combine with 5-HTP — additive serotonin elevation',
    ],
    contraindications: [
      'Concurrent SSRI/SNRI/MAO inhibitor use without medical supervision',
      'Carcinoid syndrome',
      'Eosinophilia-myalgia syndrome history',
    ],
    time_to_benefit: '30-60 minutes for sleep onset, 2-4 weeks for mood improvement',
    cost_monthly: '$15-25',
  },

  glycine: {
    name: 'Glycine',
    category: 'amino_acids',
    evidence_rating: 4,
    primary_uses: ['sleep', 'collagen_synthesis', 'liver_detox', 'blood_sugar', 'glutathione_precursor'],
    dose_standard: '3g before bed for sleep, 5-10g for other uses',
    timing: 'bedtime',
    timing_notes:
      'Take 3g one hour before bedtime for sleep — glycine lowers core body temperature by increasing peripheral blood flow, mimicking the natural thermoregulatory process of sleep onset. Can also be taken with meals for blood sugar benefit. Sweet taste makes it easy to dissolve in water. Glycine in magnesium glycinate provides both glycine and magnesium benefits.',
    form_matters: false,
    mechanism:
      'Inhibitory neurotransmitter that lowers core body temperature to promote sleep. Key precursor for glutathione synthesis (along with NAC and glutamate). Major component of collagen (every third amino acid). Conjugates bile acids for fat digestion. Supports phase II liver detoxification via glycine conjugation.',
    drug_interactions: [
      'May enhance effects of antipsychotic medications (clozapine) — studied as adjunctive therapy',
      'May potentiate sedatives and sleep medications',
      'Generally very safe with minimal drug interactions',
      'Safe to combine with magnesium glycinate — complementary effects',
    ],
    time_to_benefit: '1 night for sleep improvement, 4-8 weeks for collagen and detox effects',
    cost_monthly: '$10-18',
  },

  taurine: {
    name: 'Taurine',
    category: 'amino_acids',
    evidence_rating: 4,
    primary_uses: ['heart_health', 'bile_acid_conjugation', 'electrolyte_balance', 'exercise_performance', 'neuroprotection'],
    dose_standard: '1-3g daily',
    timing: 'with_meals',
    timing_notes:
      'Take with meals, especially fatty meals to support bile acid conjugation and fat digestion. Can split into 2 doses. For exercise performance, take 1-3g 1 hour pre-workout. Taurine is the most abundant free amino acid in the heart — supplementation supports cardiac contractility and rhythm. Well-tolerated at doses up to 6g daily in studies.',
    form_matters: false,
    mechanism:
      'Conjugates bile acids for fat digestion and cholesterol excretion. Osmolyte that regulates cell volume and electrolyte balance. Modulates calcium signaling in cardiac muscle. Antioxidant that scavenges hypochlorous acid. Supports GABAergic signaling for calming effect. A 2023 Science paper linked taurine decline to aging in animal models.',
    drug_interactions: [
      'May potentiate effects of blood pressure medications — monitor BP',
      'May enhance effects of diabetes medications — monitor blood sugar',
      'Lithium and taurine both affect renal electrolyte handling — monitor levels',
      'Generally very safe with minimal drug interactions',
    ],
    time_to_benefit: '2-4 weeks for cardiovascular and energy effects',
    cost_monthly: '$10-18',
  },

  l_carnitine: {
    name: 'L-Carnitine / ALCAR',
    category: 'amino_acids',
    evidence_rating: 4,
    primary_uses: ['fat_metabolism', 'mitochondrial_support', 'fertility', 'statin_support', 'cognitive', 'exercise_recovery'],
    dose_standard: '500-2000mg daily',
    timing: 'morning_with_meals',
    timing_notes:
      'Take in the morning with food. Acetyl-L-carnitine (ALCAR) crosses blood-brain barrier and is preferred for cognitive benefit. L-carnitine L-tartrate (LCLT) is preferred for exercise performance. Standard L-carnitine is used for fat metabolism and statin-induced carnitine depletion. High doses (>3g) may cause fishy body odor from TMAO production.',
    form_matters: true,
    best_form: 'ALCAR (acetyl-L-carnitine) for brain and nerves. L-carnitine L-tartrate for exercise. Standard L-carnitine for metabolic support.',
    mechanism:
      'Transports long-chain fatty acids across the inner mitochondrial membrane for beta-oxidation. ALCAR form provides acetyl groups for acetylcholine synthesis. Statins deplete carnitine as a secondary effect of HMG-CoA reductase inhibition. Essential for sperm motility and maturation.',
    drug_interactions: [
      'May potentiate warfarin anticoagulant effect — monitor INR',
      'Valproic acid depletes carnitine — supplementation recommended',
      'May enhance thyroid hormone activity — monitor in hypothyroid patients',
      'Statins deplete carnitine — supplementation is supportive',
    ],
    time_to_benefit: '2-4 weeks for energy, 3-6 months for fertility effects',
    cost_monthly: '$15-30',
  },

  creatine: {
    name: 'Creatine Monohydrate',
    category: 'amino_acids',
    evidence_rating: 5,
    primary_uses: ['muscle_strength', 'brain_energy', 'exercise_performance', 'methylation_support', 'neuroprotection'],
    dose_standard: '3-5g daily',
    timing: 'any_time',
    timing_notes:
      'Timing does not matter — creatine works by saturating muscle and brain stores over time, not by acute dosing. Take 3-5g daily with any meal. Loading phase (20g/day for 5-7 days) is optional and only accelerates saturation by 1 week. No need to cycle. Mix in water or any beverage. One of the most studied and safest supplements in existence.',
    form_matters: true,
    best_form: 'Creatine monohydrate — the most studied form with strongest evidence. Creapure brand is pharmaceutical grade. Fancy forms (HCl, buffered, ethyl ester) have no proven advantage.',
    mechanism:
      'Donates phosphate group to regenerate ATP from ADP, supporting high-intensity energy output. Saturates phosphocreatine stores in muscle and brain. Reduces the burden on SAMe methylation cycle (creatine synthesis consumes ~40% of SAMe methyl groups). Neuroprotective via mitochondrial energy support.',
    drug_interactions: [
      'NSAIDs combined with creatine may increase theoretical kidney stress — stay well hydrated',
      'May cause minor creatinine elevation on kidney function tests — this is benign and expected',
      'Caffeine may partially blunt acute performance benefits but does not negate long-term loading',
      'Generally very safe — no clinically significant drug interactions',
    ],
    time_to_benefit: '2-4 weeks for muscle saturation, cognitive benefits may take 4-8 weeks',
    cost_monthly: '$10-15',
  },

  collagen_peptides: {
    name: 'Collagen Peptides (Hydrolyzed)',
    category: 'amino_acids',
    evidence_rating: 3,
    primary_uses: ['joint_health', 'skin_elasticity', 'gut_lining', 'hair_strength', 'bone_health'],
    dose_standard: '10-20g daily',
    timing: 'any_time',
    timing_notes:
      'Timing is flexible — can be added to coffee, smoothies, or any beverage. Hydrolyzed collagen peptides are well-absorbed regardless of food timing. For joint-specific benefit, type II collagen (UC-II) at 40mg daily is an alternative with different mechanism (immune modulation). Combine with vitamin C (cofactor for collagen synthesis) for best results.',
    form_matters: true,
    best_form: 'Hydrolyzed collagen peptides (types I and III) for skin, hair, and gut. UC-II (undenatured type II, 40mg) specifically for joint cartilage via immune tolerance mechanism.',
    mechanism:
      'Provides bioactive peptides (hydroxyproline-proline, hydroxyproline-glycine) that stimulate fibroblasts and chondrocytes to increase collagen synthesis. Not simply "raw material" — the peptides themselves act as signaling molecules. Also provides glycine, proline, and hydroxyproline for endogenous collagen production.',
    drug_interactions: [
      'Generally very safe with no significant drug interactions',
      'Calcium content in some marine collagen products may interact with medications affected by calcium',
      'May theoretically affect blood sugar — monitor in diabetic patients',
    ],
    time_to_benefit: '4-8 weeks for skin hydration, 8-12 weeks for joint benefit, 3-6 months for hair and nail effects',
    cost_monthly: '$20-35',
  },

  // ─── FATTY ACIDS ────────────────────────────────────────────────────

  evening_primrose_oil: {
    name: 'Evening Primrose Oil (GLA)',
    category: 'essential_fatty_acids',
    evidence_rating: 3,
    primary_uses: ['hormonal_balance', 'pms_relief', 'skin_health', 'eczema', 'breast_tenderness'],
    dose_standard: '1000-1500mg daily (providing 80-135mg GLA)',
    timing: 'with_meals',
    timing_notes:
      'Take with a fat-containing meal for best absorption. Split into 2 doses. For PMS and breast tenderness, start supplementation in the luteal phase (after ovulation) or take continuously. Effects are cumulative and require 2-3 cycles to fully evaluate. Can also apply topically for skin conditions.',
    form_matters: true,
    best_form: 'Cold-pressed evening primrose oil standardized to 8-10% GLA. Borage oil is an alternative with higher GLA content (20-24%) but may contain pyrrolizidine alkaloids unless PA-free certified.',
    mechanism:
      'Rich source of gamma-linolenic acid (GLA), an omega-6 fatty acid that is converted to DGLA and then to anti-inflammatory prostaglandin E1 (PGE1). Many people have impaired delta-6-desaturase enzyme activity (needed to convert LA to GLA), making direct GLA supplementation beneficial.',
    drug_interactions: [
      'May potentiate anticoagulants and antiplatelet agents — monitor for bleeding',
      'Phenothiazine antipsychotics — GLA may lower seizure threshold in susceptible individuals',
      'May interact with anesthesia — discontinue 2 weeks before surgery',
    ],
    time_to_benefit: '2-3 menstrual cycles for PMS/hormonal effects, 4-8 weeks for skin improvement',
    cost_monthly: '$12-20',
  },

  black_seed_oil: {
    name: 'Black Seed Oil (Nigella sativa)',
    category: 'essential_fatty_acids',
    evidence_rating: 3,
    primary_uses: ['immune_support', 'anti_inflammatory', 'blood_sugar', 'histamine_modulation', 'respiratory'],
    dose_standard: '1-2 teaspoons (2-4g) daily or 500mg thymoquinone-standardized capsules',
    timing: 'with_meals',
    timing_notes:
      'Take with food to improve absorption of thymoquinone (the primary active compound). Can be taken as oil or in capsule form. Start with lower dose and increase gradually as it has a strong, peppery taste. Cold-pressed, unrefined oil retains more active compounds.',
    form_matters: true,
    best_form: 'Cold-pressed, unrefined black seed oil or capsules standardized to thymoquinone content (minimum 1-2%)',
    mechanism:
      'Thymoquinone is the primary bioactive compound with demonstrated anti-inflammatory (NF-kB inhibition), antioxidant, immunomodulatory, and hypoglycemic properties. Also contains thymohydroquinone which has antihistamine activity, and thymol with antimicrobial properties.',
    drug_interactions: [
      'May potentiate diabetes medications — monitor blood sugar for hypoglycemia',
      'May potentiate anticoagulants — monitor for bleeding',
      'May potentiate antihypertensives — monitor blood pressure',
      'Inhibits CYP3A4 and CYP2D6 — may increase levels of drugs metabolized by these enzymes',
    ],
    time_to_benefit: '2-4 weeks for immune and anti-inflammatory effects, 4-8 weeks for blood sugar improvement',
    cost_monthly: '$15-25',
  },

  // ─── ADAPTOGENS & HERBS ─────────────────────────────────────────────

  rhodiola_rosea: {
    name: 'Rhodiola Rosea',
    category: 'adaptogens',
    evidence_rating: 3,
    primary_uses: ['energy', 'stress_resilience', 'exercise_performance', 'mild_depression', 'fatigue'],
    dose_standard: '200-400mg daily standardized extract',
    timing: 'morning',
    timing_notes:
      'Take in the morning on empty stomach — rhodiola is mildly stimulating and may interfere with sleep if taken after 2pm. Do not combine with other stimulants initially. Cycle 5 days on, 2 days off or 3 weeks on, 1 week off to prevent tolerance. Effects are often felt within the first week.',
    form_matters: true,
    best_form: 'Standardized to 3% rosavins and 1% salidroside (the ratio found in the root). SHR-5 extract has the most clinical evidence.',
    mechanism:
      'Modulates cortisol response by influencing the HPA axis. Increases serotonin and dopamine by inhibiting MAO and COMT enzymes. Activates AMPK for cellular energy. Enhances oxygen utilization during exercise. Classified as an adaptogen — normalizes stress response rather than purely stimulating.',
    drug_interactions: [
      'MAO inhibitors — rhodiola has mild MAO-inhibiting properties, theoretical interaction',
      'SSRIs — potential additive serotonergic effect, use with caution',
      'Stimulant medications — additive stimulatory effect',
      'Diabetes medications — may lower blood sugar',
    ],
    contraindications: [
      'Bipolar disorder — may trigger manic episodes due to stimulating and serotonergic properties',
    ],
    time_to_benefit: '3-7 days for energy and focus, 2-4 weeks for stress resilience and mood',
    cost_monthly: '$15-25',
  },

  holy_basil_tulsi: {
    name: 'Holy Basil (Tulsi)',
    category: 'adaptogens',
    evidence_rating: 3,
    primary_uses: ['stress', 'blood_sugar', 'anti_inflammatory', 'immune_support', 'cognitive'],
    dose_standard: '300-600mg standardized extract or 2-3 cups tulsi tea daily',
    timing: 'morning_or_split',
    timing_notes:
      'Can be taken as capsule or brewed as tea (which itself has a calming ritual effect). Morning dosing for energy and stress resilience. Split dose for blood sugar support. Generally calming without being sedating. Tea form is gentler and well-suited for daily adaptogenic support.',
    form_matters: false,
    mechanism:
      'Modulates cortisol and corticosterone levels. Contains eugenol (anti-inflammatory, COX-2 inhibition), ursolic acid (anticancer, anti-inflammatory), and rosmarinic acid (antioxidant). Enhances antioxidant enzyme activity (SOD, catalase). Mild hypoglycemic effect through multiple pathways.',
    drug_interactions: [
      'May potentiate anticoagulants — eugenol has antiplatelet properties',
      'May potentiate diabetes medications — monitor blood sugar',
      'May slow blood clotting — discontinue 2 weeks before surgery',
      'Theoretical interaction with thyroid medications — may affect thyroid hormone levels',
    ],
    contraindications: [
      'Pregnancy — may have uterotonic effects at high doses',
    ],
    time_to_benefit: '1-2 weeks for stress relief, 4-8 weeks for blood sugar and metabolic effects',
    cost_monthly: '$12-20',
  },

  maca_root: {
    name: 'Maca Root (Lepidium meyenii)',
    category: 'adaptogens',
    evidence_rating: 3,
    primary_uses: ['hormonal_balance', 'energy', 'libido', 'menopause_support', 'fertility'],
    dose_standard: '1500-3000mg daily',
    timing: 'morning',
    timing_notes:
      'Take in the morning with breakfast. Maca is mildly energizing and best avoided in the evening. Gelatinized maca is easier to digest than raw. Different colors may have different effects — black maca for male fertility, red maca for prostate and bone, yellow maca for general energy. Allow 6-8 weeks for full hormonal effects.',
    form_matters: true,
    best_form: 'Gelatinized maca root powder or extract — gelatinization removes starch and concentrates active compounds while improving digestibility',
    mechanism:
      'Does NOT contain hormones or phytoestrogens. Instead, macamides and macaenes appear to act on the hypothalamus to optimize hormone signaling. Supports HPG (hypothalamic-pituitary-gonadal) axis regulation. Enhances libido independent of testosterone levels in clinical trials.',
    drug_interactions: [
      'Theoretical interaction with hormone-sensitive conditions — maca modulates the HPG axis',
      'May theoretically interact with hormone replacement therapy',
      'Generally very safe with minimal drug interactions',
      'No known CYP enzyme interactions',
    ],
    contraindications: [
      'Hormone-sensitive cancers — use with caution until more data available',
      'Thyroid conditions — maca contains glucosinolates which may be goitrogenic in iodine-deficient individuals',
    ],
    time_to_benefit: '2-4 weeks for energy, 6-8 weeks for libido and hormonal effects, 3-6 months for fertility',
    cost_monthly: '$15-25',
  },

  milk_thistle_silymarin: {
    name: 'Milk Thistle (Silymarin)',
    category: 'liver_support',
    evidence_rating: 4,
    primary_uses: ['liver_protection', 'detoxification', 'cholesterol', 'blood_sugar', 'antioxidant'],
    dose_standard: '200-400mg silymarin daily (standardized to 80% silymarin)',
    timing: 'with_meals',
    timing_notes:
      'Take with meals for better absorption. Split into 2-3 doses for sustained hepatoprotective effect. Phytosome (Siliphos) form has significantly improved bioavailability. Particularly important for anyone on hepatotoxic medications, regular alcohol use, or with fatty liver disease.',
    form_matters: true,
    best_form: 'Silymarin phytosome (Siliphos/silybin-phosphatidylcholine complex) for maximum bioavailability — 4-10x better absorbed than standard silymarin',
    mechanism:
      'Stabilizes hepatocyte cell membranes, preventing toxin entry. Stimulates ribosomal RNA polymerase to enhance liver protein synthesis and regeneration. Potent antioxidant that increases hepatic glutathione by up to 35%. Inhibits NF-kB inflammatory pathway. Silybin is the most active flavonolignan component.',
    drug_interactions: [
      'Inhibits CYP3A4, CYP2C9, and UGT enzymes — may increase levels of drugs metabolized by these pathways',
      'May reduce effectiveness of oral contraceptives through UGT induction',
      'May enhance blood sugar lowering of diabetes medications',
      'Raloxifene levels may be increased',
    ],
    time_to_benefit: '4-8 weeks for liver enzyme improvement, 8-12 weeks for fatty liver changes',
    cost_monthly: '$15-25',
  },

  tongkat_ali: {
    name: 'Tongkat Ali (Eurycoma longifolia)',
    category: 'adaptogens',
    evidence_rating: 3,
    primary_uses: ['testosterone_support', 'stress', 'libido', 'cortisol_modulation', 'body_composition'],
    dose_standard: '200-400mg daily (standardized 100:1 or 200:1 extract)',
    timing: 'morning',
    timing_notes:
      'Take in the morning with or without food. Standardized hot-water root extract (100:1 or 200:1 concentration) is the clinically studied form. Effects on testosterone are primarily through reducing SHBG (increasing free testosterone) and modulating cortisol rather than directly increasing total testosterone. Cycle 5 days on, 2 off.',
    form_matters: true,
    best_form: 'Standardized hot-water root extract (100:1 or 200:1). Physta and LJ100 are clinically studied branded extracts with verified eurycomanone content.',
    mechanism:
      'Eurycomanone and glycosaponins reduce SHBG, increasing free testosterone. Quassinoids modulate cortisol by acting on the HPA axis. Also inhibits aromatase enzyme (reducing estrogen conversion) and may stimulate Leydig cell testosterone production. Clinical studies show reduced cortisol:testosterone ratio.',
    drug_interactions: [
      'May potentiate diabetes medications — monitor blood sugar',
      'Theoretical interaction with hormone-sensitive conditions',
      'May affect anticoagulant therapy — limited data',
      'May enhance effects of testosterone replacement therapy',
    ],
    contraindications: [
      'Hormone-sensitive cancers (prostate, breast) — use only under medical supervision',
      'Pregnancy and breastfeeding',
    ],
    time_to_benefit: '2-4 weeks for energy and stress, 4-8 weeks for hormonal and body composition effects',
    cost_monthly: '$20-35',
  },

  ginkgo_biloba: {
    name: 'Ginkgo Biloba',
    category: 'nootropics',
    evidence_rating: 3,
    primary_uses: ['cognitive_function', 'circulation', 'antioxidant', 'tinnitus', 'eye_health'],
    dose_standard: '120-240mg daily standardized extract',
    timing: 'morning_or_split',
    timing_notes:
      'Split into 2 doses (60-120mg each) for sustained effect. Take with meals. EGb 761 is the most clinically studied extract. Allow 6-8 weeks for cognitive benefits. Evidence is stronger for improving blood flow and peripheral circulation than for preventing dementia.',
    form_matters: true,
    best_form: 'Standardized extract (EGb 761) containing 24% ginkgo flavone glycosides and 6% terpene lactones',
    drug_interactions: [
      'Potentiates anticoagulants and antiplatelet drugs — risk of bleeding (contains ginkgolides that inhibit PAF)',
      'May interact with anticonvulsants — may reduce seizure threshold',
      'CYP3A4 inducer — may reduce levels of drugs metabolized by this enzyme',
      'Trazodone — case report of excessive sedation when combined',
      'Discontinue 2 weeks before surgery',
    ],
    contraindications: [
      'Bleeding disorders or active anticoagulant therapy without monitoring',
      'Scheduled surgery within 2 weeks',
      'Seizure disorders — may lower seizure threshold',
    ],
    time_to_benefit: '4-6 weeks for circulation, 6-12 weeks for cognitive effects',
    cost_monthly: '$12-20',
  },

  elderberry: {
    name: 'Elderberry (Sambucus nigra)',
    category: 'immune_support',
    evidence_rating: 3,
    primary_uses: ['immune_support', 'cold_flu_duration', 'antiviral', 'antioxidant'],
    dose_standard: '500-1000mg daily for prevention, 1000-2000mg during illness',
    timing: 'with_meals',
    timing_notes:
      'Take with food. For prevention, standard daily dosing. During active cold/flu, increase dose and take every 3-4 hours for the first 48 hours of symptoms. Syrup, gummies, or capsules are all effective if properly standardized. Raw or unripe elderberries contain cyanogenic glycosides and must never be consumed raw.',
    form_matters: true,
    best_form: 'Standardized extract (Sambucol or similar) with verified anthocyanin content. Syrup and lozenges provide additional throat-soothing benefit during illness.',
    mechanism:
      'Anthocyanins and flavonoids directly inhibit viral neuraminidase (similar mechanism to oseltamivir/Tamiflu). Also stimulates cytokine production to enhance immune response. Contains high levels of vitamin C and phenolic compounds for antioxidant defense.',
    drug_interactions: [
      'Immunosuppressants — elderberry stimulates immune function and may counteract immunosuppressive therapy',
      'Diabetes medications — elderberry may lower blood sugar',
      'Diuretics — elderberry has mild diuretic properties',
      'Theophylline — may affect drug levels',
    ],
    contraindications: [
      'Active autoimmune disease flare — immune stimulation may worsen symptoms',
      'Transplant recipients on immunosuppressants',
    ],
    time_to_benefit: '24-48 hours for acute cold/flu symptom reduction, ongoing for prevention',
    cost_monthly: '$12-20',
  },

  quercetin: {
    name: 'Quercetin',
    category: 'bioflavonoids',
    evidence_rating: 4,
    primary_uses: ['antihistamine', 'anti_inflammatory', 'immune_support', 'cardiovascular', 'allergy_relief'],
    dose_standard: '500-1000mg daily',
    timing: 'with_meals',
    timing_notes:
      'Take with meals containing fat for absorption (quercetin is poorly water-soluble). Phytosome or liposomal forms significantly improve bioavailability. For allergy prevention, start 2-4 weeks before allergy season. Works synergistically with vitamin C and bromelain. Acts as a zinc ionophore — enhances intracellular zinc delivery.',
    form_matters: true,
    best_form: 'Quercetin phytosome (Quercefit) for best bioavailability — up to 20x better absorbed than standard quercetin. Alternatively, combine standard quercetin with bromelain.',
    mechanism:
      'Stabilizes mast cells to prevent histamine release (natural antihistamine). Inhibits lipoxygenase and cyclooxygenase inflammatory pathways. Zinc ionophore — facilitates zinc transport across cell membranes for intracellular antiviral activity. Potent antioxidant and senolytic (clears senescent cells) at higher doses.',
    drug_interactions: [
      'Inhibits CYP3A4, CYP2C8, and P-glycoprotein — may increase levels of many drugs',
      'May potentiate anticoagulants — monitor for bleeding',
      'May increase cyclosporine and digoxin levels',
      'May enhance effects of fluoroquinolone antibiotics',
    ],
    time_to_benefit: '2-4 weeks for allergy and histamine effects, 4-8 weeks for anti-inflammatory benefit',
    cost_monthly: '$15-25',
  },

  resveratrol: {
    name: 'Resveratrol (Trans-Resveratrol)',
    category: 'polyphenols',
    evidence_rating: 3,
    primary_uses: ['cardiovascular', 'anti_aging', 'anti_inflammatory', 'blood_sugar', 'neuroprotection'],
    dose_standard: '150-500mg daily',
    timing: 'morning_with_fat',
    timing_notes:
      'Take with a fat-containing meal in the morning. Trans-resveratrol is the active isomer — ensure product specifies trans form. Bioavailability is low; micronized or liposomal formulations improve absorption. May interfere with exercise adaptations if taken immediately post-workout (blunts hormetic oxidative stress signaling). Separate from exercise by 4+ hours.',
    form_matters: true,
    best_form: 'Trans-resveratrol (not cis-form). Micronized or liposomal for improved bioavailability. Japanese knotweed (Polygonum cuspidatum) is the most common source.',
    mechanism:
      'Activates SIRT1 (sirtuin 1) and AMPK — key longevity and metabolic pathways. Inhibits NF-kB inflammatory signaling. Mimics caloric restriction at the cellular level. Improves endothelial function via eNOS activation. Anti-platelet and cardioprotective effects partially explain the "French Paradox" of red wine consumption.',
    drug_interactions: [
      'Inhibits CYP3A4, CYP2D6, CYP2C9 — may increase levels of many drugs',
      'Potentiates anticoagulants and antiplatelet agents — increased bleeding risk',
      'May potentiate diabetes medications — monitor blood sugar',
      'May reduce efficacy of immunosuppressants',
      'Estrogenic activity at high doses — caution with hormone-sensitive conditions',
    ],
    contraindications: [
      'Hormone-sensitive cancers — estrogenic activity at high doses',
      'Scheduled surgery within 2 weeks — antiplatelet effect',
    ],
    time_to_benefit: '4-8 weeks for inflammatory markers, 8-12 weeks for cardiovascular benefit',
    cost_monthly: '$20-35',
  },

  lions_mane: {
    name: "Lion's Mane (Hericium erinaceus)",
    category: 'medicinal_mushrooms',
    evidence_rating: 3,
    primary_uses: ['cognitive_function', 'nerve_growth', 'focus', 'mood', 'gut_health'],
    dose_standard: '500-1000mg extract or 3-5g powder daily',
    timing: 'morning',
    timing_notes:
      "Take in the morning for cognitive benefit. Both hot-water and dual-extract (hot-water + alcohol) preparations are used — hot-water extracts beta-glucans (immune), alcohol extracts hericenones and erinacines (NGF-stimulating compounds). Look for products specifying fruiting body extract rather than mycelium on grain.",
    form_matters: true,
    best_form: "Dual extract (hot-water + alcohol) from fruiting body, standardized to beta-glucans and hericenones/erinacines. Avoid mycelium-on-grain products which are mostly starch.",
    mechanism:
      "Hericenones and erinacines stimulate nerve growth factor (NGF) synthesis in the brain. NGF is critical for neuronal survival, growth, and myelination. Also stimulates brain-derived neurotrophic factor (BDNF). Beta-glucans provide immunomodulatory activity. Cytoprotective effects on gastric mucosa support gut health.",
    drug_interactions: [
      'May potentiate anticoagulants — lion\'s mane has antiplatelet properties in vitro',
      'May potentiate diabetes medications — may lower blood sugar',
      'Immunomodulatory — use caution with immunosuppressants',
      'Generally well-tolerated with few documented drug interactions',
    ],
    time_to_benefit: '2-4 weeks for focus and mood, 8-16 weeks for nerve regeneration and cognitive improvement',
    cost_monthly: '$20-35',
  },

  reishi: {
    name: 'Reishi (Ganoderma lucidum)',
    category: 'medicinal_mushrooms',
    evidence_rating: 3,
    primary_uses: ['immune_modulation', 'sleep', 'stress', 'liver_support', 'allergy_management'],
    dose_standard: '1000-2000mg extract daily',
    timing: 'evening',
    timing_notes:
      'Take in the evening — reishi is calming and supports sleep quality. Dual extract (hot-water for beta-glucans + alcohol for triterpenes) captures the full spectrum of active compounds. Triterpenes (ganoderic acids) are the compounds responsible for liver-protective and anti-inflammatory effects. Allow 4-8 weeks for immune-modulating effects.',
    form_matters: true,
    best_form: 'Dual extract (hot-water + alcohol) from fruiting body. Spore oil is the most concentrated form for triterpenes. Avoid mycelium-on-grain products.',
    mechanism:
      'Beta-glucans modulate immune function by activating macrophages, NK cells, and dendritic cells — immunomodulating rather than simply stimulating. Triterpenes (ganoderic acids) inhibit histamine release, support liver detoxification, and have adaptogenic effects on the HPA axis. Traditionally known as the "mushroom of immortality" in Chinese medicine.',
    drug_interactions: [
      'Potentiates anticoagulants and antiplatelet agents — monitor for bleeding',
      'May potentiate antihypertensives — monitor blood pressure',
      'Immunomodulatory — may interact with immunosuppressants',
      'May potentiate diabetes medications — monitor blood sugar',
    ],
    contraindications: [
      'Scheduled surgery within 2 weeks — antiplatelet effect',
      'Active bleeding disorders',
      'Transplant recipients on immunosuppressants — consult physician',
    ],
    time_to_benefit: '1-2 weeks for sleep, 4-8 weeks for immune modulation and stress adaptation',
    cost_monthly: '$20-35',
  },

  // ─── GUT HEALTH ─────────────────────────────────────────────────────

  probiotics_multi_strain: {
    name: 'Probiotics (Multi-Strain)',
    category: 'gut_health',
    evidence_rating: 4,
    primary_uses: ['gut_microbiome', 'immune_support', 'mood', 'digestion', 'antibiotic_recovery'],
    dose_standard: '10-50 billion CFU daily',
    timing: 'morning_with_food',
    timing_notes:
      'Take with breakfast or a meal — food buffers stomach acid and improves bacterial survival. Spore-based probiotics (Bacillus) can be taken any time as they resist stomach acid. During antibiotic therapy, take probiotics 2-4 hours away from antibiotic dose and continue for 2-4 weeks after antibiotic course ends. Strain specificity matters — different strains have different clinical evidence.',
    form_matters: true,
    best_form: 'Multi-strain formulation including Lactobacillus and Bifidobacterium species. Strain-specific products (e.g., Lactobacillus rhamnosus GG, Saccharomyces boulardii) for targeted indications. Spore-based (Bacillus coagulans, Bacillus subtilis) for shelf stability and stomach acid resistance.',
    note: 'Strain specificity matters more than CFU count. L. rhamnosus GG for antibiotic-associated diarrhea. S. boulardii for C. difficile prevention. VSL#3 for IBD. B. infantis 35624 for IBS.',
    drug_interactions: [
      'Antibiotics reduce probiotic efficacy — separate by 2-4 hours',
      'Immunosuppressants — live bacteria may pose risk in severely immunocompromised patients',
      'Antifungals may reduce efficacy of Saccharomyces boulardii',
      'Generally very safe with minimal drug interactions',
    ],
    contraindications: [
      'Severe immunocompromise (e.g., ICU patients, severe neutropenia) — risk of bacteremia with live cultures',
      'Short bowel syndrome — risk of D-lactic acidosis with Lactobacillus strains',
    ],
    time_to_benefit: '1-2 weeks for digestive improvement, 4-8 weeks for immune and mood effects',
    cost_monthly: '$20-40',
  },

  digestive_enzymes: {
    name: 'Digestive Enzymes',
    category: 'gut_health',
    evidence_rating: 3,
    primary_uses: ['nutrient_absorption', 'bloating_relief', 'pancreatic_support', 'food_intolerance', 'gas_reduction'],
    dose_standard: 'Full-spectrum enzyme blend with each meal',
    timing: 'immediately_before_meals',
    timing_notes:
      'Take immediately before or with the first bite of a meal — enzymes need to mix with food in the stomach. One capsule per meal is typical. Higher-fat or larger meals may require additional enzymes. For specific intolerances, targeted enzymes are available (lactase for dairy, alpha-galactosidase for beans/cruciferous, DPP-IV for residual gluten). Not a substitute for treating underlying conditions.',
    form_matters: true,
    best_form: 'Full-spectrum blend including protease, lipase, amylase, cellulase, and lactase. Products measured in enzyme activity units (not just weight) are preferred. Enteric coating not typically necessary.',
    drug_interactions: [
      'May affect absorption rate of oral medications — take medications 30 minutes before meals/enzymes',
      'Acarbose and miglitol (alpha-glucosidase inhibitors) may be counteracted by amylase enzymes',
      'Blood thinners — some enzyme blends contain bromelain or nattokinase with anticoagulant properties',
      'Generally safe with minimal clinically significant interactions',
    ],
    time_to_benefit: 'Immediate effect on digestion and bloating with each meal',
    cost_monthly: '$15-30',
  },

  slippery_elm: {
    name: 'Slippery Elm (Ulmus rubra)',
    category: 'gut_health',
    evidence_rating: 2,
    primary_uses: ['gut_lining_soothing', 'acid_reflux', 'ibs_support', 'sore_throat', 'cough'],
    dose_standard: '400-800mg capsules or 1-2 tablespoons powder in water, 3x daily',
    timing: 'between_meals_or_before_bed',
    timing_notes:
      'Take between meals or 30 minutes before meals for acid reflux. For gut soothing, mix powder in warm water to form a mucilaginous drink. For sore throat, lozenges provide direct contact. IMPORTANT: Take 2 hours away from medications and other supplements — mucilage coating may slow absorption of other substances.',
    form_matters: false,
    mechanism:
      'Contains mucilage that forms a gel-like coating over mucous membranes on contact. This protective barrier soothes irritated GI tissue, reduces acid contact with esophageal and gastric mucosa, and provides a physical barrier for inflamed intestinal lining. Also contains antioxidants and has mild prebiotic activity.',
    drug_interactions: [
      'May slow absorption of ALL oral medications — always separate by at least 2 hours',
      'May reduce absorption of other supplements — separate by 2 hours',
      'No known direct pharmacological interactions',
    ],
    time_to_benefit: 'Immediate soothing effect, 2-4 weeks for sustained GI improvement',
    cost_monthly: '$10-18',
  },

  marshmallow_root: {
    name: 'Marshmallow Root (Althaea officinalis)',
    category: 'gut_health',
    evidence_rating: 2,
    primary_uses: ['gut_mucosal_lining', 'acid_reflux', 'urinary_health', 'respiratory', 'skin_health'],
    dose_standard: '500-1000mg capsules or 1-2 tablespoons root tea, 3x daily',
    timing: 'between_meals',
    timing_notes:
      'Take between meals for GI benefit. Cold-water infusion (soak root in cold water overnight) extracts maximum mucilage. Like slippery elm, separate from all medications and supplements by 2 hours due to mucilage coating effect on absorption. Can be combined with slippery elm and licorice root for comprehensive gut soothing.',
    form_matters: false,
    mechanism:
      'Rich in mucilage polysaccharides that form a protective film over mucous membranes throughout the GI tract and urinary tract. Anti-inflammatory and antioxidant properties. Stimulates epithelial cell regeneration. Traditionally used for centuries as a demulcent and emollient for inflamed tissues.',
    drug_interactions: [
      'May slow absorption of ALL oral medications — always separate by at least 2 hours',
      'May reduce effectiveness of lithium by altering excretion',
      'May potentiate diabetes medications — mild blood sugar lowering effect',
      'No known direct pharmacological interactions beyond absorption effects',
    ],
    time_to_benefit: 'Immediate soothing effect, 2-4 weeks for mucosal healing',
    cost_monthly: '$10-15',
  },

  // ─── SPECIALTY ──────────────────────────────────────────────────────

  alpha_lipoic_acid: {
    name: 'Alpha-Lipoic Acid (R-ALA)',
    category: 'antioxidants',
    evidence_rating: 4,
    primary_uses: ['blood_sugar', 'neuropathy', 'antioxidant', 'liver_support', 'heavy_metal_chelation'],
    dose_standard: '300-600mg daily',
    timing: 'empty_stomach',
    timing_notes:
      'Take on empty stomach 30 minutes before meals — food reduces absorption by up to 40%. R-lipoic acid is the natural and more potent enantiomer (R-ALA). Standard ALA is a racemic mixture (R + S). For diabetic neuropathy, 600mg daily is the clinically studied dose. Split into 2 doses for blood sugar management.',
    form_matters: true,
    best_form: 'R-lipoic acid (R-ALA) is the natural, biologically active form — 2x more potent than racemic ALA. Stabilized R-lipoic acid (Na-R-ALA) prevents polymerization.',
    mechanism:
      'Universal antioxidant — both water- and fat-soluble, active in every tissue compartment. Regenerates vitamins C and E, CoQ10, and glutathione. Activates AMPK for glucose uptake. Chelates heavy metals (mercury, lead, arsenic). Cofactor for mitochondrial enzymes (pyruvate dehydrogenase, alpha-ketoglutarate dehydrogenase).',
    drug_interactions: [
      'Potentiates diabetes medications — significant hypoglycemia risk, monitor blood sugar closely',
      'May enhance effects of thyroid medications — monitor thyroid levels',
      'Chelates minerals (iron, zinc, copper, magnesium) — separate from mineral supplements by 2 hours',
      'May affect chemotherapy agents — consult oncologist',
    ],
    time_to_benefit: '2-4 weeks for blood sugar, 3-6 months for neuropathy improvement',
    cost_monthly: '$20-35',
  },

  pqq: {
    name: 'PQQ (Pyrroloquinoline Quinone)',
    category: 'mitochondrial',
    evidence_rating: 2,
    primary_uses: ['mitochondrial_biogenesis', 'cognitive_function', 'energy', 'neuroprotection'],
    dose_standard: '10-20mg daily',
    timing: 'morning',
    timing_notes:
      'Take in the morning with or without food. Often paired with CoQ10 for synergistic mitochondrial support. PQQ is the only known compound that stimulates mitochondrial biogenesis (creation of new mitochondria) via PGC-1alpha activation. Human clinical data is still limited — most evidence is from animal and in vitro studies.',
    form_matters: true,
    best_form: 'BioPQQ (produced via natural bacterial fermentation) is the most studied form',
    mechanism:
      'Activates PGC-1alpha to stimulate mitochondrial biogenesis — the creation of entirely new mitochondria, not just improving existing ones. Also a potent redox cofactor that can perform 20,000+ catalytic cycles (vs ~4 for vitamin C). Protects neurons from oxidative stress and glutamate excitotoxicity. Supports nerve growth factor (NGF) expression.',
    drug_interactions: [
      'Generally very safe with no known significant drug interactions',
      'Theoretical antioxidant interaction with certain chemotherapy agents',
      'May have additive effects with other mitochondrial support supplements (CoQ10, L-carnitine)',
    ],
    time_to_benefit: '4-8 weeks for cognitive and energy effects',
    cost_monthly: '$20-35',
  },

  dim_diindolylmethane: {
    name: 'DIM (Diindolylmethane)',
    category: 'hormonal_support',
    evidence_rating: 3,
    primary_uses: ['estrogen_metabolism', 'hormonal_balance', 'acne', 'pms_relief', 'prostate_health'],
    dose_standard: '100-200mg daily',
    timing: 'with_meals',
    timing_notes:
      'Take with a fat-containing meal for absorption. Start with 100mg and assess tolerance — some individuals experience temporary GI upset or headache as estrogen metabolism shifts. Effects on estrogen metabolism can be verified via DUTCH test (urinary estrogen metabolites). May cause harmless darkening of urine.',
    form_matters: true,
    best_form: 'Microencapsulated or bioavailable DIM (e.g., BioResponse DIM) — unformulated DIM has very poor absorption',
    mechanism:
      'Promotes favorable estrogen metabolism by shifting the ratio of 2-hydroxyestrone (protective) to 16-alpha-hydroxyestrone (proliferative). Derived from I3C (indole-3-carbinol, found in cruciferous vegetables) but DIM is more stable and predictable. Supports phase I and phase II estrogen detoxification pathways.',
    specific_for: 'Estrogen dominance symptoms, hormonal acne, PMS, perimenopause, men with elevated estrogen',
    drug_interactions: [
      'May affect estrogen and testosterone metabolism — interact with hormone replacement therapy and oral contraceptives',
      'Modulates CYP1A1 and CYP1A2 — may affect drugs metabolized by these enzymes',
      'May reduce efficacy of tamoxifen in some estrogen receptor contexts — consult oncologist',
      'Theoretically may affect thyroid hormone metabolism through estrogen pathway changes',
    ],
    contraindications: [
      'Hormone-sensitive cancers — consult oncologist before use',
      'Pregnancy and breastfeeding',
    ],
    time_to_benefit: '4-8 weeks for hormonal symptom improvement, 2-3 menstrual cycles for full assessment',
    cost_monthly: '$15-25',
  },

  sulforaphane: {
    name: 'Sulforaphane (Broccoli Seed Extract)',
    category: 'detoxification',
    evidence_rating: 3,
    primary_uses: ['detoxification', 'nrf2_activation', 'anti_cancer', 'brain_health', 'anti_inflammatory'],
    dose_standard: '10-30mg sulforaphane daily (or equivalent glucoraphanin + myrosinase)',
    timing: 'morning',
    timing_notes:
      'Take in the morning. Fresh broccoli sprouts are the richest food source. Supplements should contain either stabilized sulforaphane or glucoraphanin with active myrosinase enzyme (which converts glucoraphanin to sulforaphane). Without myrosinase, glucoraphanin-only products rely on gut bacteria for conversion, which is highly variable.',
    form_matters: true,
    best_form: 'Stabilized sulforaphane (Prostaphane) or glucoraphanin + myrosinase combination (Avmacol, BroccoMax with myrosinase). Growing your own broccoli sprouts is the most potent and cost-effective option.',
    mechanism:
      'Most potent known activator of the NRF2 pathway — the master regulator of cellular antioxidant defense. NRF2 activation upregulates over 200 cytoprotective genes including glutathione synthesis, phase II detoxification enzymes, and anti-inflammatory pathways. Also inhibits HDAC (histone deacetylase) for epigenetic anti-cancer effects.',
    drug_interactions: [
      'May enhance activity of phase II detoxification enzymes — could theoretically alter drug clearance',
      'May interact with thyroid function in iodine-deficient individuals (glucosinolates)',
      'CYP1A2 induction may affect caffeine and theophylline metabolism',
      'Generally safe with limited drug interaction data',
    ],
    time_to_benefit: '2-4 weeks for NRF2 pathway activation, 4-8 weeks for clinical effects',
    cost_monthly: '$20-35',
  },

  melatonin_low_dose: {
    name: 'Melatonin (Low-Dose)',
    category: 'sleep_support',
    evidence_rating: 4,
    primary_uses: ['sleep_onset', 'circadian_rhythm', 'jet_lag', 'shift_work', 'antioxidant'],
    dose_standard: '0.3-1mg (NOT 5-10mg)',
    timing: 'bedtime',
    timing_notes:
      'Take 30-60 minutes before desired sleep time. Lower doses (0.3-0.5mg) mimic physiological melatonin levels and are often more effective than high doses. High doses (5-10mg) cause next-day grogginess and may desensitize melatonin receptors. For jet lag, take at destination bedtime starting 1-2 days before travel. Extended-release for sleep maintenance, immediate-release for sleep onset.',
    form_matters: true,
    best_form: 'Low-dose (0.3-1mg) immediate-release for sleep onset. Extended-release for sleep maintenance. Sublingual for faster onset. Avoid high-dose (5-10mg) products.',
    note: 'Most commercial melatonin products are dramatically overdosed. Physiological melatonin production is approximately 0.3mg. Supraphysiological doses (5-10mg) are for specific medical conditions (cluster headaches, adjunct oncology) and are not appropriate for routine sleep support.',
    drug_interactions: [
      'Potentiates sedatives, benzodiazepines, and sleep medications — additive sedation',
      'Fluvoxamine inhibits CYP1A2, dramatically increasing melatonin levels — reduce dose',
      'May affect blood pressure — monitor with antihypertensives',
      'Immunosuppressants — melatonin has immunostimulatory properties',
      'May increase blood sugar in type 2 diabetes — monitor glucose',
    ],
    contraindications: [
      'Autoimmune conditions — melatonin is immunostimulatory',
      'Depression (in some individuals melatonin worsens symptoms)',
    ],
    time_to_benefit: '1-3 nights for sleep onset improvement, 1-2 weeks for circadian rhythm resetting',
    cost_monthly: '$6-12',
  },

  nattokinase: {
    name: 'Nattokinase',
    category: 'cardiovascular',
    evidence_rating: 3,
    primary_uses: ['cardiovascular', 'fibrinolysis', 'blood_pressure', 'circulation'],
    dose_standard: '2000-4000 FU (fibrinolytic units) daily',
    timing: 'empty_stomach_or_between_meals',
    timing_notes:
      'Take on empty stomach or between meals for best fibrinolytic activity — food delays and may reduce absorption. Evening dosing may be preferred as cardiovascular events peak in morning hours, and nattokinase activity peaks 8-12 hours after ingestion. Ensure product is vitamin K2-free if on anticoagulants (natto itself contains K2, but purified nattokinase should not).',
    form_matters: true,
    best_form: 'Purified nattokinase standardized to fibrinolytic units (FU), verified free of vitamin K2. NSK-SD is a branded form specifically processed to remove vitamin K.',
    mechanism:
      'Serine protease enzyme derived from natto (fermented soybeans). Directly degrades fibrin in blood clots (fibrinolysis). Also converts pro-urokinase to urokinase and increases tissue plasminogen activator (tPA) activity. May reduce blood viscosity and lower blood pressure by inhibiting ACE.',
    drug_interactions: [
      'CRITICAL: Potentiates ALL anticoagulants (warfarin, DOACs, heparin) and antiplatelet agents — significant bleeding risk',
      'Potentiates aspirin antiplatelet effect',
      'Antihypertensives — additive blood pressure lowering',
      'Discontinue at least 2 weeks before any surgery or dental procedure',
    ],
    contraindications: [
      'Active bleeding or bleeding disorders',
      'Concurrent anticoagulant therapy without medical supervision',
      'Pre-surgery — discontinue 2 weeks before',
      'History of hemorrhagic stroke',
    ],
    time_to_benefit: '4-8 weeks for blood pressure and cardiovascular markers',
    cost_monthly: '$15-25',
  },

  citrus_bergamot: {
    name: 'Citrus Bergamot',
    category: 'cardiovascular',
    evidence_rating: 3,
    primary_uses: ['cholesterol_management', 'metabolic_syndrome', 'blood_sugar', 'cardiovascular'],
    dose_standard: '500-1000mg daily standardized extract',
    timing: 'with_meals',
    timing_notes:
      'Take with meals, typically split into 2 doses. Bergamot polyphenolic fraction (BPF) is the clinically studied form. Most evidence comes from Italian clinical studies in patients with metabolic syndrome. Effects on lipids are additive to statin therapy — some practitioners use it to allow lower statin doses. Allow 8-12 weeks for lipid panel changes.',
    form_matters: true,
    best_form: 'Bergamot Polyphenolic Fraction (BPF) standardized to flavonoid content (naringin, neoeriocitrin, neohesperidin). Bergavit and Bergamonte are clinically studied brands.',
    mechanism:
      'Contains 3-hydroxy-3-methylglutaryl flavanones that inhibit HMG-CoA reductase (same target as statins) and activate AMPK. Naringin inhibits cholesterol absorption. Clinical trials show significant reductions in total cholesterol, LDL, triglycerides, and blood glucose, with increases in HDL. Unique among natural products in affecting multiple metabolic parameters simultaneously.',
    drug_interactions: [
      'May potentiate statin effects — additive HMG-CoA reductase inhibition (beneficial but monitor for myopathy)',
      'May potentiate diabetes medications — monitor blood sugar',
      'Bergamot contains furanocoumarins — may inhibit CYP3A4 like grapefruit (though to a lesser degree)',
      'May potentiate antihypertensives',
    ],
    time_to_benefit: '4-8 weeks for blood sugar, 8-12 weeks for significant cholesterol changes',
    cost_monthly: '$25-40',
  },

  tudca: {
    name: 'TUDCA (Tauroursodeoxycholic Acid)',
    category: 'liver_support',
    evidence_rating: 3,
    primary_uses: ['liver_protection', 'bile_acid_support', 'gut_barrier', 'endoplasmic_reticulum_stress', 'cholestasis'],
    dose_standard: '250-500mg daily',
    timing: 'with_meals',
    timing_notes:
      'Take with meals for bile acid function. Start at 250mg and increase gradually. TUDCA is a water-soluble bile acid that protects against the toxic effects of hydrophobic bile acids. Particularly useful during or after oral steroid cycles, for those on hepatotoxic medications, or for general liver support. Can be taken long-term at moderate doses.',
    form_matters: true,
    best_form: 'Pharmaceutical-grade TUDCA. Ensure purity certification as bile acid supplements vary in quality.',
    mechanism:
      'Hydrophilic bile acid that displaces toxic hydrophobic bile acids from the bile acid pool, protecting hepatocytes from bile acid-induced apoptosis. Potent chemical chaperone that resolves endoplasmic reticulum (ER) stress — relevant to metabolic syndrome, neurodegeneration, and insulin resistance. Strengthens gut barrier integrity by reducing bile acid-mediated intestinal permeability. FDA-approved (as ursodiol/UDCA) for primary biliary cholangitis.',
    drug_interactions: [
      'May affect absorption of other medications — bile acid binding effects',
      'Cholestyramine and other bile acid sequestrants reduce TUDCA absorption — separate by 4 hours',
      'May enhance effects of diabetes medications — improved insulin sensitivity',
      'Cyclosporine — bile acids may affect cyclosporine absorption',
    ],
    time_to_benefit: '4-8 weeks for liver enzyme improvement, 8-12 weeks for bile acid pool optimization',
    cost_monthly: '$25-40',
  },
};
