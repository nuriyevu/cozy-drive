import styles from '../styles/table'

import React from 'react'
import { translate } from '../lib/I18n'

import FilenameCell from '../containers/FilenameCell'
import AddFolder from '../containers/AddFolder'

const Table = ({ t, f, files = [] }) => (
  <table class={styles['fil-content-table']} role='contentinfo'>
    <thead>
      <tr>
        <th class={styles['fil-content-file']}>{ t('table.head_name') }</th>
        <th>{ t('table.head_update') }</th>
        <th>{ t('table.head_size') }</th>
        <th>{ t('table.head_status') }</th>
      </tr>
    </thead>
    <tbody>
      <AddFolder />
      {files.map((file, idx) => (
        <tr>
          <FilenameCell index={idx} attributes={file} />
          <td>
            <time datetime=''>{ f(file.created_at, 'MMM D, YYYY') }</time>
          </td>
          <td>—</td>
          <td>—</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default translate()(Table)
