<script setup lang="tsx">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { fetchGetLoginLogList } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import LoginLogSearch from './modules/login-log-search.vue';

dayjs.extend(utc);

const appStore = useAppStore();

const { columns, data, getData, getDataByPage, loading, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetLoginLogList,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 20,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    username: null,
    domain: null,
    address: null,
    type: null
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'username',
      title: 'username',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'domain',
      title: 'domain',
      align: 'center',
      width: 80
    },
    {
      key: 'loginTime',
      title: 'loginTime',
      align: 'center',
      minWidth: 100,
      render(row) {
        return dayjs(row.loginTime).utc().add(8, 'hour').format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      key: 'port',
      title: 'port',
      align: 'center',
      width: 80
    },
    {
      key: 'address',
      title: 'address',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'userAgent',
      title: 'userAgent',
      align: 'center',
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'requestId',
      title: 'requestId',
      align: 'center',
      width: 80
    },
    {
      key: 'type',
      title: 'type',
      align: 'center',
      width: 80
    }
  ]
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <LoginLogSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="login log" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation :loading="loading" @refresh="getData" />
      </template>
      <NDataTable
        striped
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
