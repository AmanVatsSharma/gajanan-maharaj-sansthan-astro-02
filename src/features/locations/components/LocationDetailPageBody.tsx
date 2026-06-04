"use client";

import { MapPin, Phone, ArrowLeft } from "lucide-react";
import type { Location } from "@/data/sansthan-data";
import { AmenityList } from "@/features/locations/components/AmenityList";
import { LocationBookingCtas } from "@/features/locations/components/LocationBookingCtas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FAQ } from "@/components/seo/FAQ";
import type { FAQItem } from "@/data/faq";

interface LocationDetailPageBodyProps {
  location: Location;
  faqs?: FAQItem[];
}

export function LocationDetailPageBody({ location, faqs }: LocationDetailPageBodyProps) {
  return (
    <div className="container py-12">
      <Breadcrumbs
        items={[
          { name: "Locations", url: "/locations" },
          { name: location.name, url: `/locations/${location.id}` },
        ]}
        className="mb-6"
      />
      <a
        href="/locations"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-brand-saffron mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Locations
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-brand-maroon mb-2">
              {location.name}
            </h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2 text-brand-saffron" />
              {location.address}
            </div>
          </div>

          <div className="aspect-video bg-muted rounded-xl overflow-hidden relative">
            {location.images[0] ? (
              <img
                src={location.images[0]}
                alt={`${location.name} ${location.city} - Temple accommodation building exterior and entrance view`}
                width={1200}
                height={675}
                className="absolute inset-0 h-full w-full object-cover object-center"
                fetchPriority="high"
              />
            ) : (
              <div className="w-full h-full bg-brand-saffron/10 flex items-center justify-center text-brand-maroon/50 font-medium text-lg">
                Image Not Available
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold font-heading text-brand-maroon mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed">{location.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-heading text-brand-maroon mb-4">
              Facilities &amp; Amenities
            </h2>
            <AmenityList amenities={location.amenities} />
          </div>

          {faqs && faqs.length > 0 && (
            <FAQ
              faqs={faqs}
              title={`Frequently Asked Questions — ${location.name}`}
              description={`Common questions about visiting and staying at ${location.name}, ${location.city}.`}
            />
          )}

          <div>
            <h2 className="text-2xl font-bold font-heading text-brand-maroon mb-4">Room Types</h2>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[520px] w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground font-medium">
                    <tr>
                      <th className="p-3 sm:p-4">Type</th>
                      <th className="p-3 sm:p-4">Capacity</th>
                      <th className="p-3 sm:p-4">AC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {location.facilities.map((facility, idx) => (
                      <tr key={idx}>
                        <td className="p-3 sm:p-4 font-medium">{facility.name}</td>
                        <td className="p-3 sm:p-4">{facility.capacity} Persons</td>
                        <td className="p-3 sm:p-4">{facility.ac ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Accommodation</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationBookingCtas
                locationId={location.id}
                locationName={location.name}
                locationCity={location.city}
              />
            </CardContent>
          </Card>

          {location.contact.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {location.contact.map((phone, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-brand-saffron" />
                      {phone}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
