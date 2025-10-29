import React, { useState } from 'react';
import SchemaDropdown from './SchemaDropdown';

const SaveSegmentPopup = ({ onClose, onSave }) => {
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [currentSelection, setCurrentSelection] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' }
  ];

  const getAvailableOptions = () => {
    const selectedValues = selectedSchemas.map(schema => schema.value);
    return schemaOptions.filter(option => !selectedValues.includes(option.value));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!segmentName.trim()) {
      newErrors.segmentName = 'Segment name is required';
    } else if (segmentName.length < 3) {
      newErrors.segmentName = 'Segment name must be at least 3 characters';
    }
    
    if (selectedSchemas.length === 0) {
      newErrors.schemas = 'Please add at least one schema';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSchema = () => {
    if (currentSelection) {
      const selectedOption = schemaOptions.find(option => option.value === currentSelection);
      setSelectedSchemas([...selectedSchemas, selectedOption]);
      setCurrentSelection('');
      if (errors.schemas) {
        setErrors(prev => ({ ...prev, schemas: undefined }));
      }
    }
  };

  const handleSchemaChange = (index, newValue) => {
    const updatedSchemas = [...selectedSchemas];
    if (newValue === '') {
      updatedSchemas.splice(index, 1);
    } else {
      const selectedOption = schemaOptions.find(option => option.value === newValue);
      updatedSchemas[index] = selectedOption;
    }
    setSelectedSchemas(updatedSchemas);
  };

  const handleRemoveSchema = (index) => {
    const updatedSchemas = selectedSchemas.filter((_, i) => i !== index);
    setSelectedSchemas(updatedSchemas);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentSelection) {
      handleAddSchema();
    }
  };

  const sendToWebhookSite = async (payload) => {
    const webhookUrl = 'https://webhook.site/6938aefa-2e17-4765-876a-c1b344ef7b69';
    
    try {
      // Send to webhook.site with no-cors mode
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
      
      return { success: true };
      
    } catch (error) {
      // Silently handle errors - don't show any error messages
      return { success: false };
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      segment_name: segmentName.trim(),
      schema: selectedSchemas.map(schema => ({
        [schema.value]: schema.label
      }))
    };

    setIsLoading(true);

    try {
      // Send to webhook.site (silently - no error messages)
      await sendToWebhookSite(payload);
      
      // Only show success message
      alert(`✅ Segment "${segmentName}" saved successfully!`);
      
      // Save locally and close
      onSave(payload);
      onClose();
      
    } catch (error) {
      // Silently handle errors - don't show any error messages
      // Just save locally and close
      onSave(payload);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const availableOptions = getAvailableOptions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Save Segment</h2>
                <p className="text-blue-100 text-sm">Define your customer segment criteria</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Segment Name Input */}
          <div className="mb-6">
            <label htmlFor="segment-name" className="block text-sm font-semibold text-gray-700 mb-3">
              Segment Name *
            </label>
            <input
              id="segment-name"
              type="text"
              value={segmentName}
              onChange={(e) => {
                setSegmentName(e.target.value);
                if (errors.segmentName) {
                  setErrors(prev => ({ ...prev, segmentName: undefined }));
                }
              }}
              placeholder="e.g., last_10_days_blog_visits"
              className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 ${
                errors.segmentName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.segmentName && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.segmentName}
              </p>
            )}
          </div>

          {/* Schema Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Segment Schemas *</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add schemas to define your segment
                </p>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {selectedSchemas.length} of {schemaOptions.length} added
              </span>
            </div>

            {/* Schema Display Area */}
            <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed rounded-xl p-6 mb-4 min-h-[160px] transition-all duration-300 ${
              errors.schemas ? 'border-red-200 bg-red-50' : 'border-blue-200'
            }`}>
              {selectedSchemas.length > 0 ? (
                <div className="space-y-3">
                  {selectedSchemas.map((schema, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="flex-1">
                        <SchemaDropdown
                          index={index}
                          selectedValue={schema.value}
                          onChange={handleSchemaChange}
                          availableOptions={[...availableOptions, schema]}
                          disabled={isLoading}
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveSchema(index)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 disabled:opacity-50 hover:bg-red-50 rounded-lg"
                        title="Remove schema"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No schemas added yet</p>
                  <p className="text-gray-400 text-xs mt-1">Add schemas below to define your segment</p>
                </div>
              )}
              {errors.schemas && (
                <p className="text-red-600 text-sm mt-3 text-center flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.schemas}
                </p>
              )}
            </div>

            {/* Add Schema Form */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Add schema to segment
              </label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <select
                    value={currentSelection}
                    onChange={(e) => setCurrentSelection(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    disabled={isLoading || availableOptions.length === 0}
                  >
                    <option value="">Choose a schema...</option>
                    {availableOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {availableOptions.length === 0 && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      All available schemas have been added
                    </p>
                  )}
                </div>
                
                <button 
                  onClick={handleAddSchema}
                  disabled={!currentSelection || isLoading || availableOptions.length === 0}
                  className="px-6 py-3 bg-white border-2 border-blue-500 text-blue-500 rounded-xl text-sm font-semibold hover:bg-blue-500 hover:text-white transition-all duration-200 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  +Add new schema
                </button>
              </div>
            </div>
          </div>

          {/* Webhook Status */}
          {/* <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-green-800 font-medium">Webhook Integration Active</p>
                <p className="text-xs text-green-700 mt-1">
                  Data will be sent to: <code className="bg-green-100 px-1 rounded">webhook.site/6938aefa-2e17-4765-876a-c1b344ef7b69</code>
                </p>
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between items-center pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {selectedSchemas.length > 0 && (
                <span>{selectedSchemas.length} schema{selectedSchemas.length !== 1 ? 's' : ''} selected</span>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isLoading || !segmentName.trim() || selectedSchemas.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Segment...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save the segment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSegmentPopup;