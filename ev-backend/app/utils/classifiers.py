def is_ev_station(place: dict) -> bool:
    name = (place.get("name") or "").lower()
    address = (place.get("formatted_address") or place.get("vicinity") or "").lower()
    text = f"{name} {address}"

    ev_keywords = [
        "ev", "electric vehicle", "electric charging", "ev charging",
        "charging station", "ev station", "charger", "fast charger",
        "dc charger", "dc fast", "ccs", "ccs2", "ac charger", "type 2",
        "charging point", "ev point", "ev plug", "electric point",
        "electric vehicle charging", "public charging", "charging facility",
    ]

    negative_keywords = [
        "hotel", "restaurant", "cafe", "mall", "school", "college",
        "hospital", "apartment", "residency", "hostel", "office", "complex",
    ]

    for neg in negative_keywords:
        if neg in text:
            return False

    for kw in ev_keywords:
        if kw in text:
            return True

    return False


def extract_charger_types(place_name: str, place_address: str = "") -> list[str]:
    text = f"{place_name} {place_address}".lower()

    if "ccs" in text or "ccs2" in text:
        return ["CCS"]
    if "chademo" in text:
        return ["CHAdeMO"]
    if "type 2" in text or "type2" in text:
        return ["Type 2"]

    if any(brand in text for brand in ["tata", "tata power"]):
        return ["CCS", "Type 2"]
    if "ather" in text:
        return ["Type 2"]
    if "ola" in text:
        return ["CCS"]
    if "mahindra" in text:
        return ["Type 2"]
    if "tesla" in text:
        return ["Tesla Supercharger"]
    if "bpcl" in text or "iocl" in text or "hpcl" in text:
        return ["CCS", "CHAdeMO"]
    if "adani" in text:
        return ["CCS", "Type 2"]
    if "reliance" in text:
        return ["CCS"]

    if any(word in text for word in ["highway", "expressway", "toll"]):
        return ["DC Fast", "CCS"]
    if any(word in text for word in ["mall", "shopping", "complex"]):
        return ["AC", "Type 2"]
    if "airport" in text:
        return ["CCS", "Type 2"]

    if "fast" in text or "rapid" in text or "dc" in text:
        return ["DC Fast"]
    if "slow" in text or "ac" in text:
        return ["AC"]

    return []
