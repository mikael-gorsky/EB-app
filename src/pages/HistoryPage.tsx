// src/pages/HistoryPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navigation from '../components/common/Navigation';
import { supabase } from '../utils/supabaseClient';
import ConfirmDialog from '../components/common/ConfirmDialog';

// Define types for data structures
interface MessageData {
 id: string;
 content: string;
 message_type: string;
}

interface AnalysisResult {
 id: string;
 created_at: string;
 metrics: any;
 message_id: string;
}

interface MessagesMap {
 [key: string]: MessageData;
}

// Define the type for analysis data
interface AnalysisItem {
 id: string;
 created_at: string;
 content: string;
 type: string;
 metrics: any;
}

const PageContainer = styled.div`
 min-height: 100vh;
 background-color: #f5f5f5;
 display: flex;
 flex-direction: column;
 padding-bottom: 20px;
`;

const HeaderContainer = styled.div`
 background-color: white;
 padding: 15px 20px;
 margin-bottom: 20px;
 box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
 color: #38a3a5;
 font-size: 1.5rem;
 margin: 10px 0;
`;

const ContentContainer = styled.div`
 flex: 1;
 padding: 0 20px;
`;

const AnalysisList = styled.div`
 display: flex;
 flex-direction: column;
 gap: 15px;
`;

const AnalysisCard = styled.div`
 background-color: white;
 border-radius: 10px;
 overflow: hidden;
 box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const AnalysisHeader = styled.div`
 padding: 15px;
 border-bottom: 1px solid #eee;
 display: flex;
 justify-content: space-between;
 align-items: center;
`;

const AnalysisDate = styled.span`
 color: #666;
 font-size: 0.9rem;
`;

const AnalysisType = styled.span`
 color: #38a3a5;
 font-weight: bold;
 font-size: 0.9rem;
`;

const AnalysisContent = styled.div`
 padding: 15px;
 color: #333;
 font-size: 0.95rem;
 max-height: 100px;
 overflow: hidden;
 display: -webkit-box;
 -webkit-line-clamp: 3;
 -webkit-box-orient: vertical;
`;

const AnalysisFooter = styled.div`
 padding: 10px 15px;
 background-color: #f9f9f9;
 display: flex;
 justify-content: space-between;
 align-items: center;
`;

const FooterButton = styled.button`
 background-color: transparent;
 border: none;
 color: #38a3a5;
 font-weight: 500;
 cursor: pointer;
 font-size: 0.9rem;
 padding: 5px 10px;
 
 &:hover {
   text-decoration: underline;
 }
`;

const DeleteButton = styled(FooterButton)`
 color: #e74c3c;
`;

const CompareContainer = styled.div`
 margin-top: 20px;
 background-color: white;
 border-radius: 10px;
 padding: 15px;
 box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const CompareTitle = styled.h2`
 color: #38a3a5;
 font-size: 1.2rem;
 margin-bottom: 15px;
`;

const CompareButton = styled.button`
 background-color: #38a3a5;
 color: white;
 border: none;
 border-radius: 5px;
 padding: 10px 15px;
 cursor: pointer;
 font-weight: 500;
 margin-top: 10px;
 
 &:hover {
   background-color: #2c8385;
 }
 
 &:disabled {
   background-color: #ccc;
   cursor: not-allowed;
 }
`;

const EmptyState = styled.div`
 text-align: center;
 padding: 40px 20px;
 color: #666;
`;

const LoadingState = styled.div`
 text-align: center;
 padding: 40px 20px;
 color: #666;
`;

const ErrorState = styled.div`
 text-align: center;
 padding: 20px;
 color: #e74c3c;
 background-color: #fde2e2;
 border-radius: 10px;
 margin: 20px 0;
`;

const CheckboxContainer = styled.div`
 display: flex;
 align-items: center;
 gap: 10px;
`;

const Checkbox = styled.input`
 cursor: pointer;
 width: 18px;
 height: 18px;
`;

const HistoryPage: React.FC = () => {
 const navigate = useNavigate();
 const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
 const [showConfirmDelete, setShowConfirmDelete] = useState(false);
 const [itemToDelete, setItemToDelete] = useState<string | null>(null);

 useEffect(() => {
   fetchAnalyses();
 }, []);

 const fetchAnalyses = async () => {
   try {
     setLoading(true);
     
     // Fetch analysis results first
     const { data: analysisData, error: analysisError } = await supabase
       .from('analysis_results')
       .select(`
         id,
         created_at,
         metrics,
         message_id
       `)
       .order('created_at', { ascending: false });
     
     if (analysisError) throw analysisError;
     
     if (!analysisData || analysisData.length === 0) {
       setAnalyses([]);
       setLoading(false);
       return;
     }
     
     // Get all message_ids
     const messageIds = analysisData.map(item => item.message_id);
     
     // Fetch related messages
     const { data: messagesData, error: messagesError } = await supabase
       .from('messages')
       .select('id, content, message_type')
       .in('id', messageIds);
     
     if (messagesError) throw messagesError;
     
     // Create a map of message data by id for easy lookup with proper typing
     const messagesMap: MessagesMap = {};
     if (messagesData) {
       messagesData.forEach((message: MessageData) => {
         messagesMap[message.id] = message;
       });
     }
     
     // Format the data for display by combining analysis and message data
     const formattedData = analysisData.map((item: AnalysisResult) => ({
       id: item.id,
       created_at: item.created_at,
       content: messagesMap[item.message_id]?.content || 'No content available',
       type: messagesMap[item.message_id]?.message_type || 'Unknown',
       metrics: item.metrics || {},
     }));
     
     setAnalyses(formattedData);
   } catch (error) {
     console.error('Error fetching analyses:', error);
     setError('Failed to load analysis history');
   } finally {
     setLoading(false);
   }
 };

 const handleDeleteClick = (id: string) => {
   setItemToDelete(id);
   setShowConfirmDelete(true);
 };

 const handleConfirmDelete = async () => {
   if (!itemToDelete) return;
   
   try {
     const { error } = await supabase
       .from('analysis_results')
       .delete()
       .eq('id', itemToDelete);
       
     if (error) throw error;
     
     // Remove from selected if it was selected
     setSelectedAnalyses(prev => prev.filter(id => id !== itemToDelete));
     
     // Update the analyses list
     setAnalyses(prev => prev.filter(item => item.id !== itemToDelete));
     
   } catch (error) {
     console.error('Error deleting analysis:', error);
     setError('Failed to delete analysis');
   } finally {
     setShowConfirmDelete(false);
     setItemToDelete(null);
   }
 };

 const handleViewDetail = (id: string) => {
   navigate(`/analysis/${id}`);
 };

 const handleToggleSelect = (id: string) => {
   setSelectedAnalyses(prev => {
     if (prev.includes(id)) {
       return prev.filter(item => item !== id);
     } else {
       // Only allow selecting up to 2 analyses
       if (prev.length < 2) {
         return [...prev, id];
       }
       return prev;
     }
   });
 };

 const handleCompare = () => {
   if (selectedAnalyses.length === 2) {
     navigate(`/compare/${selectedAnalyses[0]}/${selectedAnalyses[1]}`);
   }
 };

 const formatDate = (dateString: string) => {
   const date = new Date(dateString);
   return date.toLocaleDateString('en-US', {
     year: 'numeric',
     month: 'short',
     day: 'numeric',
     hour: '2-digit',
     minute: '2-digit'
   });
 };

 return (
   <PageContainer>
     <Navigation />
     <HeaderContainer>
       <PageTitle>Analysis History</PageTitle>
     </HeaderContainer>
     <ContentContainer>
       {loading ? (
         <LoadingState>Loading your analysis history...</LoadingState>
       ) : error ? (
         <ErrorState>{error}</ErrorState>
       ) : analyses.length === 0 ? (
         <EmptyState>You don't have any analyses yet.</EmptyState>
       ) : (
         <>
           {selectedAnalyses.length > 0 && (
             <CompareContainer>
               <CompareTitle>Compare Analyses</CompareTitle>
               <p>{selectedAnalyses.length} of 2 selected</p>
               <CompareButton 
                 disabled={selectedAnalyses.length !== 2}
                 onClick={handleCompare}
               >
                 Compare Selected
               </CompareButton>
             </CompareContainer>
           )}
           
           <AnalysisList>
             {analyses.map((item) => (
               <AnalysisCard key={item.id}>
                 <AnalysisHeader>
                   <AnalysisDate>{formatDate(item.created_at)}</AnalysisDate>
                   <AnalysisType>{item.type}</AnalysisType>
                 </AnalysisHeader>
                 <AnalysisContent>{item.content}</AnalysisContent>
                 <AnalysisFooter>
                   <CheckboxContainer>
                     <Checkbox 
                       type="checkbox"
                       checked={selectedAnalyses.includes(item.id)}
                       onChange={() => handleToggleSelect(item.id)}
                       id={`select-${item.id}`}
                     />
                     <label htmlFor={`select-${item.id}`}>Select</label>
                   </CheckboxContainer>
                   <div>
                     <FooterButton onClick={() => handleViewDetail(item.id)}>
                       View Details
                     </FooterButton>
                     <DeleteButton onClick={() => handleDeleteClick(item.id)}>
                       Delete
                     </DeleteButton>
                   </div>
                 </AnalysisFooter>
               </AnalysisCard>
             ))}
           </AnalysisList>
         </>
       )}
     </ContentContainer>
     
     {showConfirmDelete && (
       <ConfirmDialog
         message="Are you sure you want to delete this analysis? This action cannot be undone."
         onConfirm={handleConfirmDelete}
         onCancel={() => setShowConfirmDelete(false)}
       />
     )}
   </PageContainer>
 );
};

export default HistoryPage;