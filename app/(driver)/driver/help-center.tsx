import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.faqItem}>
            <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setExpanded(!expanded)}
                activeOpacity={0.7}
            >
                <Text style={styles.question}>{question}</Text>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={Colors.textLight}
                />
            </TouchableOpacity>
            {expanded && (
                <Animated.View layout={Layout.springify()}>
                    <Text style={styles.answer}>{answer}</Text>
                </Animated.View>
            )}
        </View>
    );
};

export default function HelpCenterScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help Center</Text>
                <View style={{ width: 24 }} />
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                <FAQItem
                    question="How do I view my earnings?"
                    answer="You can view your daily, weekly, and monthly earnings in the Earnings tab. Tap on any entry to see detailed breakdowns."
                />
                <FAQItem
                    question="How do I change my vehicle details?"
                    answer="Go to Account > Vehicle Information to update your vehicle make, model, year, or plate number."
                />
                <FAQItem
                    question="What if a passenger leaves an item behind?"
                    answer="Please report lost items immediately through the 'Contact Us' page or call support directly."
                />
                <FAQItem
                    question="How are fares calculated?"
                    answer="Fares are calculated based on time and distance, plus a base fare. Surge pricing may apply during high demand."
                />
                <FAQItem
                    question="How do I update my documents?"
                    answer="Go to Account > Documents to upload new photos of your license, ID, or vehicle registration."
                />

                <View style={styles.contactSupport}>
                    <Text style={styles.contactTitle}>Still need help?</Text>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => router.push('/(driver)/driver/contact-us')}
                    >
                        <Text style={styles.contactButtonText}>Contact Support</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
    },
    faqItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        flex: 1,
        marginRight: 10,
    },
    answer: {
        marginTop: 12,
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    contactSupport: {
        marginTop: 32,
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#E8F5E9',
        borderRadius: 16,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    contactButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    contactButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
});
