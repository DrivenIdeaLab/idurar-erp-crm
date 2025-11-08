import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function ServiceRecord() {
  const translate = useLanguage();
  const entity = 'servicerecord';

  const searchConfig = {
    displayLabels: ['number', 'vehicle', 'customer'],
    searchFields: 'number,vehicle,customer',
  };

  const deleteModalLabels = ['number'];

  const entityDisplayLabels = ['number'];

  const Labels = {
    PANEL_TITLE: translate('service_record'),
    DATATABLE_TITLE: translate('service_record_list'),
    ADD_NEW_ENTITY: translate('add_new_service'),
    ENTITY_NAME: translate('service_record'),
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
