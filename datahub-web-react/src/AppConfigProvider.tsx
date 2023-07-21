import React, { useEffect, useState } from 'react'
import './App.less'
import { THIRD_PARTY_LOGGING_KEY } from './app/analytics/analytics'
import { checkAuthStatus } from './app/auth/checkAuthStatus'
import { AppConfigContext, DEFAULT_APP_CONFIG } from './appConfigContext'
import { useAppConfigQuery } from './graphql/app.generated'
import { ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { getTranslationForAntd } from './conf/locales/i18nUtils'
import styled from 'styled-components/macro'
import { BorderOutlined } from '@ant-design/icons'

const NoDataContainer = styled.div`
  margin: auto;
  text-align: center;
`

function changeFavicon (src) {
  const links = document.querySelectorAll('link[rel~=\'icon\']') as any
  if ( ! links || links.length === 0) {
    const link = document.createElement('link')
    link.rel = 'icon'
    document.getElementsByTagName('head')[ 0 ].appendChild(link)
  }
  links.forEach((link) => {
    // eslint-disable-next-line no-param-reassign
    link.href = src
  })
}

const AppConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation()

  // Change form alert language
  const [validateMessages, setValidateMessages] = useState(t('form.validateMessages', { returnObjects: true }) as any)
  i18n.on('languageChanged', () => setValidateMessages(t('form.validateMessages', { returnObjects: true })))

  const { data: appConfigData, refetch } = useAppConfigQuery({ fetchPolicy: 'no-cache' })

  const refreshAppConfig = () => {
    refetch()
  }

  useEffect(() => {
    if (appConfigData && appConfigData.appConfig) {
      if (appConfigData.appConfig.telemetryConfig.enableThirdPartyLogging) {
        localStorage.setItem(THIRD_PARTY_LOGGING_KEY, 'true')
        checkAuthStatus() // identify in analytics once we receive config response
      } else {
        localStorage.setItem(THIRD_PARTY_LOGGING_KEY, 'false')
      }
      changeFavicon(appConfigData.appConfig.visualConfig.faviconUrl)
    }
  }, [appConfigData])

  return ( <AppConfigContext.Provider
    value={ { config: appConfigData?.appConfig || DEFAULT_APP_CONFIG, refreshContext: refreshAppConfig } }
  >
    <ConfigProvider locale={ getTranslationForAntd(i18n.language) } form={ { validateMessages } }
                    renderEmpty={ () => <NoDataContainer>
                      <BorderOutlined/> { t('common.noData') }
                    </NoDataContainer> }>
      { children }
    </ConfigProvider>
  </AppConfigContext.Provider> )
}

export default AppConfigProvider
