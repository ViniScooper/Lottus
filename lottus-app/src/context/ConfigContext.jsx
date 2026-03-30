import React, { createContext, useState, useEffect } from 'react';
import { getConfig } from '../services/api';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loadingConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
