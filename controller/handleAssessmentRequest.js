// controllers/recaptchaController.js
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

/**
 * Create an assessment to analyze the risk of a UI action.
 *
 * @param {Object} params - Parameters for creating the assessment.
 * @param {string} params.projectID - Your Google Cloud Project ID.
 * @param {string} params.recaptchaKey - The reCAPTCHA site key associated with the site/app.
 * @param {string} params.token - The generated token obtained from the client.
 * @param {string} params.recaptchaAction - Action name corresponding to the token.
 * @returns {Promise<Object|null>} - Returns an object with the reCAPTCHA score and reasons or null if invalid.
 */
async function createAssessment({
  projectID = "temp-1723973117994", // Replace with your actual project ID.
  recaptchaKey = "6LevEikqAAAAAMA1Fss-QONO_4q0lJTBIa3gAGnE", // Replace with your actual reCAPTCHA site key.
  token = "action-token", // Replace with the actual token from the client.
  recaptchaAction = "action-name", // Replace with the actual action name.
}) {
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  try {
    const [response] = await client.createAssessment(request);

    if (!response.tokenProperties.valid) {
      throw new Error(`The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`);
    }

    if (response.tokenProperties.action === recaptchaAction) {
      return {
        score: response.riskAnalysis.score,
        reasons: response.riskAnalysis.reasons,
      };
    } else {
      throw new Error("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score.");
    }
  } catch (error) {
    console.error('Error creating assessment:', error);
    return null;
  } finally {
    // Optionally close the client if you are not reusing it.
    // client.close();
  }
}

/**
 * Controller function to handle assessment requests.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function handleAssessmentRequest(req, res) {
  const { projectID, recaptchaKey, token, recaptchaAction } = req.body;

  if (!token || !recaptchaAction) {
    return res.status(400).json({ error: 'Token and action are required.' });
  }

  try {
    const result = await createAssessment({
      projectID,
      recaptchaKey,
      token,
      recaptchaAction,
    });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: 'Assessment failed or invalid token.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}