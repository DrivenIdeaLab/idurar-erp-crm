import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Inspection() {
  const translate = useLanguage();
  const entity = 'inspection';

  const searchConfig = {
    displayLabels: ['vehicle', 'customer', 'inspectionDate'],
    searchFields: 'vehicle,customer',
  };

  const deleteModalLabels = ['inspectionDate'];

  const entityDisplayLabels = ['inspectionDate'];

  const Labels = {
    PANEL_TITLE: translate('inspection'),
    DATATABLE_TITLE: translate('inspection_list'),
    ADD_NEW_ENTITY: translate('add_new_inspection'),
    ENTITY_NAME: translate('inspection'),
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
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}
