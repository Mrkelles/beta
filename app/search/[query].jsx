import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, FlatList, Image, Text, View } from "react-native";
import { searchPosts } from '../../lib/appwrite';
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(
    () => searchPosts(query)
  );

  useEffect(() => {
   {
      refetch();
    }
  }, [query]);
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
      data={posts}
      keyExtractor={(item) => item.$id }
      renderItem={({item}) => (

        <VideoCard 
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            username={item.users.username}
            avatar={item.users.avatar}
        />
      )} 

      ListHeaderComponent={() => (
        <View className="flex my-6 px-4">
          <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
          <Text className="text-2xl font-psemibold text-white">{query}</Text>
          <View className="mt-6 mb-6">
            <SearchInput initialQuery={query}  refetch={refetch} />
          </View>
          
        </View>
      )}
      ListEmptyComponent={()=> (
         <EmptyState 
        title="No Videos Found"
        subtitle="No videos found for this search query"
        />
      )}
      />
    </SafeAreaView>
  )
}

export default Search;
