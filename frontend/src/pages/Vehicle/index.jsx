import CrudModule from '@/modules/CrudModule/CrudModule';
import VehicleForm from './VehicleForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Vehicle() {
  const translate = useLanguage();
  const entity = 'vehicle';

  const searchConfig = {
    displayLabels: ['vin', 'make', 'model'],
    searchFields: 'vin,make,model,licensePlate',
  };

  const deleteModalLabels = ['vin', 'make', 'model', 'year'];

  const entityDisplayLabels = ['vin'];

  const Labels = {
    PANEL_TITLE: translate('vehicle'),
    DATATABLE_TITLE: translate('vehicle_list'),
    ADD_NEW_ENTITY: translate('add_new_vehicle'),
    ENTITY_NAME: translate('vehicle'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
    entityDisplayLabels,
  };

  return (
    <CrudModule
      createForm={<VehicleForm fields={fields} />}
      updateForm={<VehicleForm fields={fields} isUpdateForm={true} />}
      config={config}
    />
  );
}
