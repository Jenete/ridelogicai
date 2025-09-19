import pdfplumber
import re

def extract_fares_from_pdf(pdf_path, output_csv=None):
    fares = []
    route_name = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            
            # Each line usually has: [Origin] to [Destination] [Code] R xxx.xx R xxxx.xx [Transfers]
            for line in text.split("\n"):
                # Match pattern: e.g., "Cape Town CIAI R 225.00 R 990.00 Zero"
                new_route = line.endswith(" to")
                if new_route:
                    route_name = line
                match = re.match(
                    r"(.+?)\s+([A-Z]{2,4})\s+R\s?([\d.,]+)\s+R\s?([\d.,]+)\s+(\w+)",
                    line
                )
                if match:
                    route = route_name+ "_"+match.group(1).strip()
                    weekly = match.group(3).replace(",", "")
                    monthly = match.group(4).replace(",", "")

                    fares.append({
                        "route": route,
                        "weekly_fare": float(weekly),
                        "monthly_fare": float(monthly),
                    })

    # Optional: save to CSV
    if output_csv:
        print(f"const fares = {fares}")

    return fares


if __name__ == "__main__":
    pdf_path = "C:\\Users\\amahl\\Downloads\\applications\\ridelogic2\\ridelogicai\\src\\scripts\\2024_09_24_Multi_Journey_Fares.pdf"  # path to your file
    fares = extract_fares_from_pdf(pdf_path, "fares.csv")
