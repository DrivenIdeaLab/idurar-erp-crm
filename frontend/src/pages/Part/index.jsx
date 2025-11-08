import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Part() {
  const translate = useLanguage();
  const entity = 'part';

  const searchConfig = {
    displayLabels: ['partNumber', 'name'],
    searchFields: 'partNumber,name,description',
  };

  const deleteModalLabels = ['partNumber', 'name'];

  const entityDisplayLabels = ['partNumber'];

  const Labels = {
    PANEL_TITLE: translate('part'),
    DATATABLE_TITLE: translate('part_list'),
    ADD_NEW_ENTITY: translate('add_new_part'),
    ENTITY_NAME: translate('part'),
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
      updateForm={<DynamicForm fields={fields} isUpdateForm={true} />}
      config={config}
    />
  );
}
