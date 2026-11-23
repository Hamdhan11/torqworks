import { AIAnalyticsEngine } from '../services/aiAnalyticsEngine.js';

export const getExecutiveAISummary = async (req, res) => {
  try {
    const summary = await AIAnalyticsEngine.getExecutiveAISummary();
    return res.json({ success: true, data: summary });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getShortagePredictions = async (req, res) => {
  try {
    const data = await AIAnalyticsEngine.predictMaterialShortages();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDelayPredictions = async (req, res) => {
  try {
    const data = await AIAnalyticsEngine.predictProductionDelays();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMachinePredictions = async (req, res) => {
  try {
    const data = await AIAnalyticsEngine.predictMachineFailures();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBottlenecks = async (req, res) => {
  try {
    const data = await AIAnalyticsEngine.detectBottlenecks();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCostOverruns = async (req, res) => {
  try {
    const data = await AIAnalyticsEngine.predictCostOverruns();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
