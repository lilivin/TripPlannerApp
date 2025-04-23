import React from 'react';
import { useAttractionDetails } from '@/components/hooks/useAttractionDetails';
import { AttractionHeader } from '@/components/AttractionHeader';
import { AttractionGallery } from '@/components/AttractionGallery';
import { AttractionInfoPanel } from '@/components/AttractionInfoPanel';
import { Card, CardContent } from '@/components/ui/card';

interface AttractionDetailsPageProps {
  attractionId: string;
}

/**
 * Main component for displaying attraction details
 * Fetches data from API and renders various sections
 */
export function AttractionDetailsPage({ attractionId }: AttractionDetailsPageProps) {
  const { data, isLoading, error } = useAttractionDetails(attractionId);

  console.log(data);

  // Handle the back button action
  const handleBack = () => {
    // Use browser history to go back
    window.history.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 mr-4 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-48 w-full bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-24 w-full bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-48 w-full bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="mb-4">{error.message}</p>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Go Back
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Data state
  if (!data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2">No Data</h2>
            <p className="mb-4">No attraction data available</p>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Go Back
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <AttractionHeader 
        name={data.name} 
        onBack={handleBack} 
      />
      
      <div className="mt-8 space-y-8">
        {/* Gallery Section */}
        <AttractionGallery images={data.images} />
        
        {/* Description Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-700">{data.description}</p>
          </CardContent>
        </Card>
        
        {/* Info Panel */}
        <AttractionInfoPanel
          address={data.address}
          openingHours={data.opening_hours}
          contactInfo={data.contact_info}
          ticketPriceInfo={data.ticket_price_info}
          accessibilityInfo={data.accessibility_info}
          averageVisitTimeMinutes={data.average_visit_time_minutes}
        />
      </div>
    </div>
  );
} 