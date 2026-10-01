"use client";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { AddressFormData, StatusMessage } from "./types";

export function useAddressGeocoding(open: boolean, initialData?: any | null) {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSearchingGeo, setIsSearchingGeo] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    text: "",
    type: "",
  });

  const [addressData, setAddressData] = useState<AddressFormData>({
    venueType: "HOME",
    fullAddress: "",
    addressLabel: "Home",
    city: "",
    state: "",
    pincode: "",
    latitude: "0",
    longitude: "0",
    isDefault: false,
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const exactRef = useRef<boolean>(false);
  const addressDebounceRef = useRef<any>(null);
  const lastSearchedQueryRef = useRef<string>("");

  // Dynamically load Mapbox CSS
  useEffect(() => {
    if (typeof document !== "undefined" && !document.getElementById("mapbox-css-cdn")) {
      const link = document.createElement("link");
      link.id = "mapbox-css-cdn";
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css";
      document.head.appendChild(link);
    }
  }, []);

  // Initialize or update Map when Dialog opens
  useEffect(() => {
    if (!open) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
      return;
    }

    if (initialData) {
      setAddressData({
        id: initialData.id,
        venueType: initialData.venueType || "HOME",
        fullAddress: initialData.fullAddress || initialData.addressLine1 || "",
        addressLabel: initialData.addressLabel || "Home",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || initialData.zipCode || "",
        latitude: initialData.latitude ? String(initialData.latitude) : "0",
        longitude: initialData.longitude ? String(initialData.longitude) : "0",
        isDefault: Boolean(initialData.isDefault),
      });
    } else {
      setAddressData({
        venueType: "HOME",
        fullAddress: "",
        addressLabel: "Home",
        city: "",
        state: "",
        pincode: "",
        latitude: "0",
        longitude: "0",
        isDefault: false,
      });
    }

    setStatusMessage({ text: "", type: "" });
    lastSearchedQueryRef.current = "";

    const timer = setTimeout(() => {
      initMap();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [open, initialData?.id]);

  const initMap = () => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }

    const token =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    mapboxgl.accessToken = token;

    const defaultLat =
      initialData?.latitude && Number(initialData.latitude) !== 0
        ? Number(initialData.latitude)
        : 22.9734;
    const defaultLng =
      initialData?.longitude && Number(initialData.longitude) !== 0
        ? Number(initialData.longitude)
        : 78.6569;

    const initialZoom =
      initialData?.latitude && Number(initialData.latitude) !== 0 ? 15 : 4;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [defaultLng, defaultLat],
      zoom: initialZoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapInstanceRef.current = map;

    map.on("load", () => {
      if (initialData?.latitude && Number(initialData.latitude) !== 0) {
        placeMarkerOnMap(defaultLat, defaultLng, initialZoom);
      }
    });

    map.on("click", (e) => {
      exactRef.current = true;
      const { lat, lng } = e.lngLat;
      setAddressData((prev) => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
      placeMarkerOnMap(lat, lng);
      reverseGeocode(lat, lng);
    });
  };

  const placeMarkerOnMap = (lat: number, lng: number, zoom?: number) => {
    if (!mapInstanceRef.current) return;

    if (!markerRef.current) {
      const marker = new mapboxgl.Marker({
        draggable: true,
        color: "#FF6200",
      })
        .setLngLat([lng, lat])
        .addTo(mapInstanceRef.current);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        exactRef.current = true;
        setAddressData((prev) => ({
          ...prev,
          latitude: lngLat.lat.toFixed(6),
          longitude: lngLat.lng.toFixed(6),
        }));
        reverseGeocode(lngLat.lat, lngLat.lng);
      });
      markerRef.current = marker;
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }

    if (zoom) {
      mapInstanceRef.current.flyTo({ center: [lng, lat], zoom });
    } else {
      mapInstanceRef.current.panTo([lng, lat]);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    setStatusMessage({
      text: "Finding address for this point...",
      type: "info",
    });
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`
      );
      if (res.ok) {
        const d = await res.json();
        const a = d.address || {};
        const rawCity =
          a.city ||
          a.town ||
          a.village ||
          a.suburb ||
          a.county ||
          a.state_district ||
          a.district ||
          "";

        let displayAddress = d.display_name || "";
        const parts = displayAddress.split(", ");
        if (parts[parts.length - 1] === "India") parts.pop();
        displayAddress = parts.join(", ");

        setAddressData((prev) => ({
          ...prev,
          fullAddress: displayAddress,
          city: rawCity,
          state: a.state || prev.state,
          pincode: (a.postcode || prev.pincode).replace(/\s/g, ""),
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
        setStatusMessage({
          text: "Address filled from the selected point.",
          type: "success",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        text: "Location coordinates updated.",
        type: "info",
      });
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage({
        text: "Geolocation is not supported by your browser.",
        type: "error",
      });
      return;
    }
    setIsFetchingLocation(true);
    setStatusMessage({ text: "Getting your location...", type: "info" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        exactRef.current = true;

        setAddressData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));

        placeMarkerOnMap(latitude, longitude, 16);
        await reverseGeocode(latitude, longitude);

        setIsFetchingLocation(false);
      },
      (err) => {
        setIsFetchingLocation(false);
        const msg =
          err.code === 1
            ? "Location permission was denied. Please allow location access."
            : err.code === 2
            ? "Your location is unavailable right now."
            : "Getting location timed out. Try again.";
        setStatusMessage({ text: msg, type: "error" });
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const geoFromFields = async (
    overridePin?: string,
    force = false,
    overrideAddress?: string
  ) => {
    const pin = (
      typeof overridePin === "string" ? overridePin : addressData.pincode
    ).trim();
    const city = addressData.city.trim();
    const state = addressData.state.trim();
    const address = (
      typeof overrideAddress === "string"
        ? overrideAddress
        : addressData.fullAddress
    ).trim();

    const validPin = /^\d{6}$/.test(pin);

    if (!address && !city && !validPin) {
      if (force || typeof overridePin === "string") {
        setStatusMessage({
          text: "Enter an address, city or 6-digit pincode first.",
          type: "error",
        });
      }
      return;
    }

    setIsSearchingGeo(true);
    setStatusMessage({ text: "Finding location...", type: "info" });

    try {
      const token =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      // Build progressive queries from most specific to broader radius
      const searchQueries: string[] = [];

      if (address) {
        // 1. Full combination (address + city + state + pin)
        searchQueries.push(
          [address, city, state, validPin ? pin : ""].filter(Boolean).join(", ")
        );
        // 2. Address + city + state
        if (city || state) {
          searchQueries.push(
            [address, city, state].filter(Boolean).join(", ")
          );
        }
        // 3. Address alone
        searchQueries.push(address);

        // 4. Extract area/road keywords if address has multiple words
        const words = address.split(/\s+/);
        if (words.length > 2) {
          const partialAddress = words.slice(1).join(" ");
          searchQueries.push(
            [partialAddress, city, state].filter(Boolean).join(", ")
          );
        }
      }

      if (validPin) {
        searchQueries.push([pin, city, state, "India"].filter(Boolean).join(", "));
        searchQueries.push(pin);
      }

      if (city) {
        searchQueries.push([city, state, "India"].filter(Boolean).join(", "));
      }

      let lat: number | null = null;
      let lon: number | null = null;

      // Primary Search: Mapbox Geocoding API
      for (const q of searchQueries) {
        try {
          const mbUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            q
          )}.json?access_token=${token}&country=IN&limit=1`;
          const res = await fetch(mbUrl);
          if (res.ok) {
            const data = await res.json();
            if (data?.features?.length > 0) {
              const feat = data.features[0];
              lon = feat.center[0];
              lat = feat.center[1];
              break;
            }
          }
        } catch (e) {
          console.error("Mapbox search error:", e);
        }
      }

      // Secondary Fallback Search: Nominatim OpenStreetMap
      if (lat === null || lon === null) {
        for (const q of searchQueries) {
          try {
            const nomUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(
              q
            )}`;
            const res = await fetch(nomUrl);
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                lat = parseFloat(data[0].lat);
                lon = parseFloat(data[0].lon);
                break;
              }
            }
          } catch (e) {
            console.error("Nominatim fallback error:", e);
          }
        }
      }

      // Tertiary Fallback for 6-digit Pincode
      if (lat === null && validPin) {
        try {
          const postRes = await fetch(
            `https://api.postalpincode.in/pincode/${pin}`
          );
          if (postRes.ok) {
            const postData = await postRes.json();
            if (
              Array.isArray(postData) &&
              postData[0]?.Status === "Success" &&
              Array.isArray(postData[0]?.PostOffice) &&
              postData[0].PostOffice.length > 0
            ) {
              const po = postData[0].PostOffice[0];
              const fallbackCity = po.District || po.Block || po.Circle || "";
              const fallbackState = po.State || "";
              const geoRes = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                  [fallbackCity, fallbackState].filter(Boolean).join(", ")
                )}.json?access_token=${token}&country=IN&limit=1`
              );
              if (geoRes.ok) {
                const geoData = await geoRes.json();
                if (geoData?.features?.length > 0) {
                  lon = geoData.features[0].center[0];
                  lat = geoData.features[0].center[1];
                }
              }
            }
          }
        } catch (postErr) {
          console.error("Postal pincode fallback error:", postErr);
        }
      }

      if (lat === null || lon === null) {
        if (force) {
          setStatusMessage({
            text: "Could not locate exact spot. Click on the map or drag the marker.",
            type: "error",
          });
        } else {
          setStatusMessage({ text: "", type: "" });
        }
        return;
      }

      setAddressData((prev) => ({
        ...prev,
        latitude: lat!.toFixed(6),
        longitude: lon!.toFixed(6),
      }));

      placeMarkerOnMap(lat, lon, 15);
      setStatusMessage({
        text: "Map pin updated for your address location!",
        type: "success",
      });
    } catch (e: any) {
      console.error(e);
      if (force) {
        setStatusMessage({
          text: "Location search failed. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsSearchingGeo(false);
    }
  };

  const lookupPincode = async (pin: string) => {
    setIsSearchingGeo(true);
    setStatusMessage({ text: "Loading location & address details for pincode...", type: "info" });

    try {
      let fetchedCity = "";
      let fetchedState = "";
      let fetchedArea = "";

      // 1. Fetch details from Postal Pincode API
      try {
        const postRes = await fetch(
          `https://api.postalpincode.in/pincode/${pin}`
        );
        if (postRes.ok) {
          const postData = await postRes.json();
          if (
            Array.isArray(postData) &&
            postData[0]?.Status === "Success" &&
            Array.isArray(postData[0]?.PostOffice) &&
            postData[0].PostOffice.length > 0
          ) {
            const po = postData[0].PostOffice[0];
            fetchedCity = po.District || po.Block || po.Circle || "";
            fetchedState = po.State || "";
            fetchedArea = po.Name || "";
          }
        }
      } catch (e) {
        console.error("Postal API lookup error:", e);
      }

      // 2. Fetch coordinates from Mapbox Geocoding API
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

      const query = [fetchedArea, fetchedCity, fetchedState, pin, "India"]
        .filter(Boolean)
        .join(", ");

      let lat = 22.9734;
      let lon = 78.6569;
      let foundCoords = false;

      try {
        const mbUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${token}&country=IN&limit=1`;
        const res = await fetch(mbUrl);
        if (res.ok) {
          const data = await res.json();
          if (data?.features?.length > 0) {
            const feat = data.features[0];
            lon = feat.center[0];
            lat = feat.center[1];
            foundCoords = true;

            const context = feat.context || [];
            for (const item of context) {
              if (item.id.startsWith("place") || item.id.startsWith("district")) {
                if (!fetchedCity) fetchedCity = item.text;
              }
              if (item.id.startsWith("region")) {
                if (!fetchedState) fetchedState = item.text;
              }
            }
          }
        }
      } catch (e) {
        console.error("Mapbox pincode geocode error:", e);
      }

      // 3. Fallback to Nominatim if Mapbox coords not found
      if (!foundCoords) {
        try {
          const nomUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(
            `${pin}, India`
          )}`;
          const res = await fetch(nomUrl);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              lat = parseFloat(data[0].lat);
              lon = parseFloat(data[0].lon);
              foundCoords = true;
            }
          }
        } catch (e) {
          console.error("Nominatim pincode fallback error:", e);
        }
      }

      const defaultAddressStr = [fetchedArea, fetchedCity, fetchedState]
        .filter(Boolean)
        .join(", ");

      setAddressData((prev) => ({
        ...prev,
        pincode: pin,
        city: fetchedCity || prev.city,
        state: fetchedState || prev.state,
        fullAddress: prev.fullAddress.trim() ? prev.fullAddress : defaultAddressStr,
        latitude: lat.toFixed(6),
        longitude: lon.toFixed(6),
      }));

      placeMarkerOnMap(lat, lon, 15);
      setStatusMessage({
        text: "City, State & location auto-filled from Pincode!",
        type: "success",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingGeo(false);
    }
  };

  const handlePincodeChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 6);
    setAddressData((prev) => ({ ...prev, pincode: digitsOnly }));
    setStatusMessage({ text: "", type: "" });

    if (digitsOnly.length === 6) {
      lookupPincode(digitsOnly);
    }
  };

  const handleAddressInputChange = (val: string) => {
    setAddressData((prev) => ({ ...prev, fullAddress: val }));

    if (addressDebounceRef.current) {
      clearTimeout(addressDebounceRef.current);
    }

    const trimmed = val.trim();
    if (trimmed.length >= 10 && trimmed !== lastSearchedQueryRef.current) {
      addressDebounceRef.current = setTimeout(() => {
        lastSearchedQueryRef.current = trimmed;
        geoFromFields(undefined, false, val);
      }, 1500);
    }
  };

  const handleAddressInputBlur = () => {
    const trimmed = addressData.fullAddress.trim();
    if (trimmed.length >= 5 && trimmed !== lastSearchedQueryRef.current) {
      if (addressDebounceRef.current) {
        clearTimeout(addressDebounceRef.current);
      }
      lastSearchedQueryRef.current = trimmed;
      geoFromFields(undefined, false, trimmed);
    }
  };

  const resetForm = () => {
    setAddressData({
      venueType: "HOME",
      fullAddress: "",
      addressLabel: "Home",
      city: "",
      state: "",
      pincode: "",
      latitude: "0",
      longitude: "0",
      isDefault: false,
    });
    setStatusMessage({ text: "", type: "" });
    exactRef.current = false;
    lastSearchedQueryRef.current = "";

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: [78.6569, 22.9734], zoom: 4 });
    }
  };

  return {
    addressData,
    setAddressData,
    statusMessage,
    isFetchingLocation,
    isSearchingGeo,
    mapContainerRef,
    fetchCurrentLocation,
    geoFromFields,
    handlePincodeChange,
    handleAddressInputChange,
    handleAddressInputBlur,
    resetForm,
  };
}
