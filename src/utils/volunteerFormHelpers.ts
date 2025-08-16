import { getUser, type UserClaims } from "../api/authApi";
import { getEmployeeDetailsById, type EmployeeDetails } from "../api/employeeApi";
import type { UserClaim, CurrentUserDetails } from "../types/volunteerFormTypes";

export const extractEmpcodeFromClaims = (claims: UserClaims): string => {
  if (Array.isArray(claims)) {
    const empcodeClaim = claims.find(
      (claim: UserClaim) => claim.type === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    );
    if (!empcodeClaim) {
      throw new Error('Employee code not found in user claims array');
    }
    return empcodeClaim.value;
  }
  
  const claimsAsAny = claims as any;
  
  if (claimsAsAny.length !== undefined) {
    const claimsArray = claimsAsAny as UserClaim[];
    const empcodeClaim = claimsArray.find(
      (claim: UserClaim) => claim.type === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    );
    if (!empcodeClaim) {
      throw new Error('Employee code not found in user claims');
    }
    return empcodeClaim.value;
  }
  
  if (claimsAsAny.name) {
    return claimsAsAny.name;
  }
  
  console.error('Unable to extract empcode from claims structure:', claims);
  throw new Error('Unable to extract employee code from user claims');
};

export const getCurrentUserDetails = async (): Promise<CurrentUserDetails> => {
  const userClaimsResponse = await getUser();
  
  const empcode = extractEmpcodeFromClaims(userClaimsResponse.data);
  
  const employeeResponse = await getEmployeeDetailsById(empcode);
  
  const employeeDetails = employeeResponse.data as EmployeeDetails;
  
  const employeeId = parseInt(empcode, 10);
  if (isNaN(employeeId)) {
    throw new Error(`Invalid employee code: ${empcode}`);
  }
  
  // ✅ Add fallbacks for potentially undefined values
  return {
    employeeId,
    empcode,
    name: employeeDetails.name || "Unknown Employee",
    emailId: employeeDetails.emailId || "",
    mobileNo: employeeDetails.mobileNo || "",
    location: employeeDetails.location || "",
    department: employeeDetails.department || "",
    designation: employeeDetails.designation || "",
    reportingManager: employeeDetails.reportingManager || "",
    dateOfJoining: employeeDetails.dateOfJoining || "",
    grade: employeeDetails.grade || "",
    businessUnit: employeeDetails.businessUnit || "",
    status: 'Active'
  };
};