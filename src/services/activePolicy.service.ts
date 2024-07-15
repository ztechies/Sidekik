import Policy from "../models/Policy";
import TermsOfUse from "../models/TermsOfUse";
import UserLicense from "../models/UserLicense";
import { CustomError } from "../middleware/errorHandler";

const getActivePolicies = async () => {
    try {
        const privacyPolicy = await Policy.findOne({ status: "active" });
        const termsOfUse = await TermsOfUse.findOne({ status: "active" })
        const userLicense = await UserLicense.findOne({ status: "active" })

        const data = {
            privacyPolicy: privacyPolicy,
            termsOfUse: termsOfUse,
            userLicense: userLicense
        }

        return data;

    } catch (error) {
        throw error
    }
}

export default { getActivePolicies }