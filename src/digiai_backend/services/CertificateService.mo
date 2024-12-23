import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Int "mo:base/Int";

actor CertificateService {

  // Function to issue a certificate
  public shared func issueCertificate(
    caller: Principal,
    userName: Text, // Add userName parameter
    courseTitle: Text,
    certificateId: Text,
    dateOfIssuance: Time.Time
  ) : async Text {
    // Generate the certificate including the user's name
    let certificate = "Certificate ID: " # certificateId # "\n" #
                      "Course: " # courseTitle # "\n" #
                      "Issued To: " # userName # "\n" #
                      "Issued On: " # formatTime(dateOfIssuance);

    // Optionally, save the certificate to a database or another persistent store
    // For simplicity, we return the certificate data as a string
    return certificate;
  };

  // Helper function to format the time for the certificate
  private func formatTime(time: Time.Time) : Text {
    let seconds = Int.abs(time / 1_000_000_000);
    let days = seconds / 86400;
    let years = seconds / 31104000;
    
    // List of months for formatting the date
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Calculate the day of the month
    let day = days % 31 + 1;
    // Calculate the month
    let monthIndex = (seconds / 2592000) % 12;
    let month = months[monthIndex];

    // Format the time in the desired structure (day - month - year)
    return Nat.toText(day) # " - " # month # " - " # Nat.toText(years + 1970);
  }

  // Function to generate a unique certificate ID based on the current time
  private func generateCertificateId() : Text {
    return "CERT-" # Nat.toText(Int.abs(Time.now() / 1_000_000_000)); // Simple ID based on time
  }

};
