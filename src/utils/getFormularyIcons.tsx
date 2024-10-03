import BALM_IMAGE from '@/assets/icons/formulary/blm.png';
import CAPSULE_IMAGE from '@/assets/icons/formulary/cap.png';
import CHEW_TAB_IMAGE from '@/assets/icons/formulary/chwTab.png';
import CREAM_IMAGE from '@/assets/icons/formulary/crm.png';
import FILM_IMAGE from '@/assets/icons/formulary/flm.png';
import GEL_IMAGE from '@/assets/icons/formulary/gel.png';
import INHALER_IMAGE from '@/assets/icons/formulary/inh.png';
import INTRAVENOUS_IMAGE from '@/assets/icons/formulary/IVSoln.png';
import JELLY_IMAGE from '@/assets/icons/formulary/jelly.png';
import LOTION_IMAGE from '@/assets/icons/formulary/ltn.png';
import NASAL_SPRAY_IMAGE from '@/assets/icons/formulary/nasalSpry.png';
import NEBULIZER_SOLUTION_IMAGE from '@/assets/icons/formulary/nebSoln.png';
import ORAL_DISINTEGRATING_IMAGE from '@/assets/icons/formulary/odt.png';
import OINTMENT_IMAGE from '@/assets/icons/formulary/oint.png';
import OPTHALMIC_OINTMENT_IMAGE from '@/assets/icons/formulary/opthOint.png';
import OPTHALMIC_SOLUION_IMAGE from '@/assets/icons/formulary/opthSoln.png';
import OTIC_SOLUTION_IMAGE from '@/assets/icons/formulary/oticSoln.png';
import PACKETS_IMAGE from '@/assets/icons/formulary/pck.png';
import PATCH_IMAGE from '@/assets/icons/formulary/ptch.png';
import POWDER_IMAGE from '@/assets/icons/formulary/pwdr.png';
import POWDER_INHALER_IMAGE from '@/assets/icons/formulary/pwdrInh.png';
import SHAMPOO_IMAGE from '@/assets/icons/formulary/shmp.png';
import SUBLINGUAL_TABLET_IMAGE from '@/assets/icons/formulary/SLTab.png';
import SOLUTION_IMAGE from '@/assets/icons/formulary/soln.png';
import SUPPOSITORY_IMAGE from '@/assets/icons/formulary/supp.png';
import SUSPENSION_IMAGE from '@/assets/icons/formulary/susp.png';
import SYRINGE_IMAGE from '@/assets/icons/formulary/syr.png';
import TABLET_IMAGE from '@/assets/icons/formulary/tab.png';
import UNIT_DOSE_IMAGE from '@/assets/icons/formulary/ud.png';
import VIAL_IMAGE from '@/assets/icons/formulary/vial.png';

import { FORMULATIONS } from './constants';

const FORMULARY_IMAGES: any = {
  blm: BALM_IMAGE,
  cap: CAPSULE_IMAGE,
  chwTab: CHEW_TAB_IMAGE,
  crm: CREAM_IMAGE,
  flm: FILM_IMAGE,
  gel: GEL_IMAGE,
  inh: INHALER_IMAGE,
  IVSoln: INTRAVENOUS_IMAGE,
  jelly: JELLY_IMAGE,
  ltn: LOTION_IMAGE,
  nasalSpry: NASAL_SPRAY_IMAGE,
  nebSoln: NEBULIZER_SOLUTION_IMAGE,
  oint: OINTMENT_IMAGE,
  opthOint: OPTHALMIC_OINTMENT_IMAGE,
  opthSoln: OPTHALMIC_SOLUION_IMAGE,
  odt: ORAL_DISINTEGRATING_IMAGE,
  oticSoln: OTIC_SOLUTION_IMAGE,
  pck: PACKETS_IMAGE,
  ptch: PATCH_IMAGE,
  pwdr: POWDER_IMAGE,
  pwdrInh: POWDER_INHALER_IMAGE,
  shmp: SHAMPOO_IMAGE,
  soln: SOLUTION_IMAGE,
  SLTab: SUBLINGUAL_TABLET_IMAGE,
  supp: SUPPOSITORY_IMAGE,
  susp: SUSPENSION_IMAGE,
  syr: SYRINGE_IMAGE,
  tab: TABLET_IMAGE,
  ud: UNIT_DOSE_IMAGE,
  vial: VIAL_IMAGE
};

export const getFormularyImageByFormulation = (formulation: string) => {
  const staticFormulation = FORMULATIONS.find((formu: any) => {
    return formu?.value === formulation;
  });
  if (staticFormulation) {
    return FORMULARY_IMAGES?.[staticFormulation?.key];
  }

  return TABLET_IMAGE;
};
