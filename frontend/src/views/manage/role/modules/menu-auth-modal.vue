<script setup lang="ts">
import { computed, reactive, shallowRef, watch } from 'vue';
import type { TreeOption } from 'naive-ui';
import { $t } from '@/locales';
import { fetchAssignRoutes, fetchGetMenuTree, fetchGetRoleMenuIds } from '@/service/api';

defineOptions({
  name: 'MenuAuthModal'
});

interface Props {
  /** the roleId */
  roleId: string;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const title = computed(() => $t('common.edit') + $t('page.manage.role.menuAuth'));

/** menu tree data */
const tree = shallowRef<TreeOption[]>([]);

/** tree checks */
const checks = shallowRef<number[]>([]);

/** menu auth model */
const model: Api.SystemManage.RoleMenu = reactive(createDefaultModel());

function createDefaultModel(): Api.SystemManage.RoleMenu {
  return {
    roleId: props.roleId,
    routeIds: []
  };
}

/** init menu tree */
async function getTree() {
  const { error, data } = await fetchGetMenuTree();
  if (!error) {
    tree.value = data.map(recursive);
  }
}

/** init get routeIds for roleId, belong checks */
async function getMenuId() {
  const { error, data } = await fetchGetRoleMenuIds(props.roleId);
  if (!error) {
    checks.value = data;
    await getTree();
  }
}

/** recursive menu tree data, add prefix transform treeOption format */
function recursive(item: Api.SystemManage.Menu): TreeOption {
  const result: TreeOption = {
    key: item.id,
    label: $t(item.i18nKey as App.I18n.I18nKey)
  };
  if (item.children && item.children.length > 0) {
    result.children = item.children.map(recursive);
  }
  return result;
}

/** submit */
async function handleSubmit() {
  // request
  model.routeIds = checks.value;
  const { error } = await fetchAssignRoutes(model);
  if (!error) {
    window.$message?.success?.($t('common.modifySuccess'));
    closeModal();
  }
}

function closeModal() {
  visible.value = false;
}

function init() {
  Object.assign(model, createDefaultModel());
  getMenuId();
}

watch(visible, val => {
  if (val) {
    init();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px">
    <NTree
      v-model:checked-keys="checks"
      :data="tree"
      block-line
      expand-on-click
      checkable
      cascade
      virtual-scroll
      class="h-500px"
    />
    <template #footer>
      <NSpace justify="end">
        <NButton quaternary @click="closeModal">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
