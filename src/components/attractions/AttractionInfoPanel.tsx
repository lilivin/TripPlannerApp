import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Json } from "@/db/database.types";

interface AttractionInfoPanelProps {
  address: string;
  openingHours: Json | null;
  contactInfo: Json | null;
  ticketPriceInfo: string | null;
  accessibilityInfo: string | null;
  averageVisitTimeMinutes?: number | null;
}

/**
 * Component for displaying practical information about an attraction
 * Contains sections for address, opening hours, contact info, tickets, and accessibility
 */
export function AttractionInfoPanel({
  address,
  openingHours,
  contactInfo,
  ticketPriceInfo,
  accessibilityInfo,
  averageVisitTimeMinutes,
}: AttractionInfoPanelProps) {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-2">Practical Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressSection address={address} />

        {openingHours && <OpeningHoursSection openingHours={openingHours} />}

        {contactInfo && <ContactInfoSection contactInfo={contactInfo} />}

        <div className="space-y-6">
          {ticketPriceInfo && <TicketInfoSection ticketPriceInfo={ticketPriceInfo} />}

          {accessibilityInfo && <AccessibilityInfoSection accessibilityInfo={accessibilityInfo} />}

          {averageVisitTimeMinutes && <VisitTimeSection averageVisitTimeMinutes={averageVisitTimeMinutes} />}
        </div>
      </div>
    </div>
  );
}

// Address section
interface AddressSectionProps {
  address: string;
}

function AddressSection({ address }: AddressSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Address</h3>
        <p className="whitespace-pre-line">{address}</p>
      </CardContent>
    </Card>
  );
}

// Opening hours section
interface OpeningHoursSectionProps {
  openingHours: Json;
}

function OpeningHoursSection({ openingHours }: OpeningHoursSectionProps) {
  // Parse openingHours based on expected format
  // This is a simple implementation, adjust based on actual data structure
  const hoursData = openingHours as Record<string, { open: string; close: string } | null>;

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Opening Hours</h3>
        <ul className="space-y-1">
          {daysOfWeek.map((day) => {
            const dayData = hoursData[day.toLowerCase()];
            return (
              <li key={day} className="flex justify-between">
                <span>{day}</span>
                <span>{dayData ? `${dayData.open} - ${dayData.close}` : "Closed"}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

// Contact info section
interface ContactInfoSectionProps {
  contactInfo: Json;
}

function ContactInfoSection({ contactInfo }: ContactInfoSectionProps) {
  // Parse contactInfo based on expected format
  // This is a simple implementation, adjust based on actual data structure
  const contactData = contactInfo as {
    phone?: string;
    email?: string;
    website?: string;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Contact Information</h3>
        <div className="space-y-2">
          {contactData.phone && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Phone:</span>
              <a href={`tel:${contactData.phone}`} className="hover:underline">
                {contactData.phone}
              </a>
            </div>
          )}

          {contactData.email && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Email:</span>
              <a href={`mailto:${contactData.email}`} className="hover:underline">
                {contactData.email}
              </a>
            </div>
          )}

          {contactData.website && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Website:</span>
              <a href={contactData.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {contactData.website}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Ticket info section
interface TicketInfoSectionProps {
  ticketPriceInfo: string;
}

function TicketInfoSection({ ticketPriceInfo }: TicketInfoSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Ticket Information</h3>
        <p className="whitespace-pre-line">{ticketPriceInfo}</p>
      </CardContent>
    </Card>
  );
}

// Accessibility info section
interface AccessibilityInfoSectionProps {
  accessibilityInfo: string;
}

function AccessibilityInfoSection({ accessibilityInfo }: AccessibilityInfoSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Accessibility</h3>
        <p className="whitespace-pre-line">{accessibilityInfo}</p>
      </CardContent>
    </Card>
  );
}

// Visit time section
interface VisitTimeSectionProps {
  averageVisitTimeMinutes: number;
}

function VisitTimeSection({ averageVisitTimeMinutes }: VisitTimeSectionProps) {
  // Convert minutes to hours and minutes format
  const hours = Math.floor(averageVisitTimeMinutes / 60);
  const minutes = averageVisitTimeMinutes % 60;

  let timeDisplay = "";
  if (hours > 0) {
    timeDisplay += `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    if (timeDisplay) timeDisplay += " ";
    timeDisplay += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Average Visit Time</h3>
        <p>{timeDisplay}</p>
      </CardContent>
    </Card>
  );
}
