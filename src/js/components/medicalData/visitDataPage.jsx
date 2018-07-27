import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { alterDataCall } from '../../redux/actions/addOrUpdateData';
import { createLevelObj, mappingFields } from './utils';
import Icon from '../icon';
import scaffold_style from '../createMedicalElements/medicalEvent.module.css';
import style from './dataPage.module.css';
import store from '../../redux/store';


const example = [
    {
        id: 7,
        definition: 'Cognitive problems',
        idname: 'cognitive functions:higher function problem: cognitive problems',
        section: 2,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 8,
        definition: 'Emotional Lability',
        idname: 'cognitive functions:higher function problem: emotional lability',
        section: 2,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 9,
        definition: 'Depression',
        idname: 'cognitive functions:higher function problem: depression',
        section: 2,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 10,
        definition: 'Fatigue',
        idname: 'cognitive functions:higher function problem: fatigue',
        section: 2,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 11,
        definition: 'Seizure',
        idname: 'cognitive functions:higher function problem: seizure',
        section: 2,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 12,
        definition: 'Oscillopsia',
        idname: 'cranial nerves:oscillopsia',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 13,
        definition: 'Vertigo',
        idname: 'cranial nerves:vertigo',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 14,
        definition: 'Blurred Vision',
        idname: 'cranial nerves:blurred vision',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 15,
        definition: 'Double Vision',
        idname: 'cranial nerves:double vision',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 16,
        definition: 'Uncontrolled Eye Movements',
        idname: 'cranial nerves:uncontrolled eye movements',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 17,
        definition: 'Dysphagia',
        idname: 'cranial nerves:dysphagia',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 18,
        definition: 'Facial Weakness',
        idname: 'cranial nerves:facial weakness',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 19,
        definition: 'Greying of vision in one eye',
        idname: 'cranial nerves:greying of vision in one eye',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 20,
        definition: 'Blindness in one eye',
        idname: 'cranial nerves:blindness in one eye',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 21,
        definition: 'Facial Pain',
        idname: 'cranial nerves:facial pain',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 22,
        definition: 'Field defect / Scotoma',
        idname: 'cranial nerves:field defect / scotoma',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 23,
        definition: 'Facial Hypoesthesia',
        idname: 'cranial nerves:facial hypoesthesia',
        section: 2,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 24,
        definition: 'Difficulty walking',
        idname: 'motor:difficulty walking',
        section: 2,
        subsection: 'Motor',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 25,
        definition: 'Weakness upper limbs',
        idname: 'Motor:weakness:upper limbs',
        section: 2,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 26,
        definition: 'weakness lower limbs',
        idname: 'Motor:weakness:lower limbs',
        section: 2,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 28,
        definition: 'Lhermitte\'s sign',
        idname: 'somatosensory:lhermitte\'s sign',
        section: 2,
        subsection: 'Somatosensory',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 29,
        definition: 'Heat intolerance',
        idname: 'somatosensory:heat intolerance',
        section: 2,
        subsection: 'Somatosensory',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 30,
        definition: 'Pain',
        idname: 'somatosensory:pain',
        section: 2,
        subsection: 'Somatosensory',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 31,
        definition: 'Paresthesia',
        idname: 'somatosensory:paresthesia',
        section: 2,
        subsection: 'Somatosensory',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 32,
        definition: 'Dysesthesia',
        idname: 'somatosensory:dysesthesia',
        section: 2,
        subsection: 'Somatosensory',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 33,
        definition: 'Anesthesia',
        idname: 'somatosensory:anesthesia',
        section: 2,
        subsection: 'Somatosensory',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 34,
        definition: 'Pruritus',
        idname: 'somatosensory:pruritus',
        section: 2,
        subsection: 'Somatosensory',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 35,
        definition: 'Bladder urgency',
        idname: 'autonomic:bladde urgency',
        section: 2,
        subsection: 'Autonomic',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 36,
        definition: 'Bladder frequency',
        idname: 'autonomic:bladder frequency',
        section: 2,
        subsection: 'Autonomic',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 37,
        definition: 'Bladder incontinence',
        idname: 'autonomic:bladder incontinence',
        section: 2,
        subsection: 'Autonomic',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 38,
        definition: 'Bladder hesitancy',
        idname: 'autonomic:bladder hesitancy',
        section: 2,
        subsection: 'Autonomic',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 39,
        definition: 'Constipation',
        idname: 'autonomic:constipation',
        section: 2,
        subsection: 'Autonomic',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 40,
        definition: 'Bowel incontinence',
        idname: 'autonomic:bowel incontinence',
        section: 2,
        subsection: 'Autonomic',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 41,
        definition: 'Problems with sexual function',
        idname: 'autonomic:problems with sexual function',
        section: 2,
        subsection: 'Autonomic',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 42,
        definition: 'Information processing speed',
        idname: 'cognitive functions:higher function problem: information processing speed',
        section: 3,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 43,
        definition: 'Executive functions',
        idname: 'cognitive functions:higher function problem: executive functions',
        section: 3,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 44,
        definition: 'Memory',
        idname: 'cognitive functions:higher function problem:memory',
        section: 3,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 45,
        definition: 'Verbal fluency',
        idname: 'cognitive functions:higher function problem:verbal fluency',
        section: 3,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 46,
        definition: 'Seizure',
        idname: 'cognitive functions:higher function problem:seizure',
        section: 3,
        subsection: 'Cognitive Functions',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 47,
        definition: 'Nystagmus',
        idname: 'cranial nerves:nystagmus',
        section: 3,
        subsection: 'Cranial Nerves',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 48,
        definition: 'Red desaturation',
        idname: 'cranial nerves:red desaturation',
        section: 3,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 49,
        definition: 'Sixth nerve palsy',
        idname: 'cranial nerves:sixth nerve palsy',
        section: 3,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 50,
        definition: 'Third nerve palsy',
        idname: 'cranial nerves:third nerve palsy',
        section: 3,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 51,
        definition: 'Trigeminal neuralgia',
        idname: 'cranial nerves:trigeminal neuralgia',
        section: 3,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 52,
        definition: 'Trigeninal palsy',
        idname: 'cranial nerves:trigeninal palsy',
        section: 3,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 53,
        definition: 'Fourth nerve palsy',
        idname: 'cranial nerves:fourth nerve palsy',
        section: 3,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 54,
        definition: 'Facial hypoesthesia',
        idname: 'cranial nerves:facial hypoesthesia',
        section: 3,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 55,
        definition: 'Hearing loss',
        idname: 'cranial nerves:hearing loss',
        section: 3,
        subsection: 'Cranial Nerves',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 56,
        definition: 'Tremor postural upper limbs',
        idname: 'motor:tremor postural upper limbs',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 57,
        definition: 'Tremor intention upper limbs',
        idname: 'motor:tremor intention upper limbs',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 58,
        definition: 'Spasticity upper limbs',
        idname: 'motor:spasticity upper limbs',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 59,
        definition: 'Spasticity lower limbs',
        idname: 'motor:spasticity lower limbs',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 60,
        definition: 'Tendon reflexes:hyperreflexia:biceps:right',
        idname: 'motor:tendon reflexes:hyperreflexia:biceps:right',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '3,4',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 61,
        definition: 'Tendon reflexes:hyperreflexia:biceps:left',
        idname: 'motor:tendon reflexes:hyperreflexia:biceps:left',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '3,4',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 62,
        definition: 'Tendon reflexes:hyperreflexia:patella:right',
        idname: 'motor:tendon reflexes:hyperreflexia:patella:right',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '3,4',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 63,
        definition: 'Tendon reflexes:hyperreflexia:patella:left',
        idname: 'motor:tendon reflexes:hyperreflexia:patella:left',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '3,4',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 64,
        definition: 'Tendon reflexes:hyperreflexia:ankle right',
        idname: 'motor:tendon reflexes:hyperreflexia:ankle right',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '3,4',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 65,
        definition: 'Tendon reflexes:hyperreflexia:ankle:left',
        idname: 'motor:tendon reflexes:hyperreflexia:ankle:left',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '3,4',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 66,
        definition: 'Tendon reflexes:hyporeflexia:biceps:right',
        idname: 'motor:tendon reflexes:hyporeflexia:biceps:right',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '1,2',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 67,
        definition: 'Tendon reflexes:hyporeflexia:biceps:left',
        idname: 'motor:tendon reflexes:hyporeflexia:biceps:left',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '1,2',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 68,
        definition: 'Tendon reflexes:hyporeflexia:patella:right',
        idname: 'motor:tendon reflexes:hyporeflexia:patella:right',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '1,2',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 69,
        definition: 'Tendon reflexes:hyporeflexia:patella:left',
        idname: 'motor:tendon reflexes:hyporeflexia:patella:left',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '1,2',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 70,
        definition: 'Tendon reflexes:hyporeflexia:ankle:right',
        idname: 'motor:tendon reflexes:hyporeflexia:ankle:right',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '1,2',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 71,
        definition: 'Tendon reflexes:hyporeflexia:ankle:left',
        idname: 'motor:tendon reflexes:hyporeflexia:ankle:left',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: '1,2',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 72,
        definition: 'Tendon reflexes:plantar response:right',
        idname: 'motor:tendon reflexes:plantar response:right',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'NORMAL,ABNORMAL,UNKNOWN',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 73,
        definition: 'Tendon reflexes:plantar response:left',
        idname: 'motor:tendon reflexes:plantar response:left',
        section: 3,
        subsection: 'Motor',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'NORMAL,ABNORMAL,UNKNOWN',
        labels: null,
        referenceType: 1
    },
    {
        id: 74,
        definition: 'Ataxia:upper limb',
        idname: 'cerebellar:ataxia:upper limb',
        section: 3,
        subsection: 'Cerebellar',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH,UNKNOWN',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 75,
        definition: 'Ataxia:lower limb',
        idname: 'cerebellar:ataxia:lower limb',
        section: 3,
        subsection: 'Cerebellar',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH,UNKNOWN',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 76,
        definition: 'Ataxia:trunk',
        idname: 'cerebellar:ataxia:trunk',
        section: 3,
        subsection: 'Cerebellar',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LEFT,RIGHT,BOTH,UNKNOWN',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 77,
        definition: 'Problem',
        idname: 'mobility:problem',
        section: 3,
        subsection: 'Mobility',
        type: 3,
        unit: null,
        module: 'MS',
        permittedValues: 'LIMITED AMBULATION,WHEELCHAIR BOUND,BEDRIDDEN,UNKNOWN',
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    },
    {
        id: 78,
        definition: 'Using walking aid',
        idname: 'mobility:using walking aid',
        section: 3,
        subsection: 'Mobility',
        type: 5,
        unit: null,
        module: 'MS',
        permittedValues: null,
        labels: null,
        referenceType: 1,
        laterality: null,
        cdiscName: null
    }];



export class BackButton extends Component {
    render() {
        return (
            <Link to={this.props.to} title='Close' className={scaffold_style.backButton}>&#10006;</Link>
        );
    }
}

function mapStateToProps(state) {
    return {
        fields: state.availableFields,
        patientProfile: state.patientProfile
    };
}


/**
 * @class DataTemplate
 * @description Renders the data page for test / visit / treatment / event data
 * @prop {String} this.props.elementType - 'test', 'visit', 'treatment', 'clinicalEvent'
 * @prop {Object} this.props.match - from router
 * @prop {Object} this.props.fields - from store
 * @prop {Object} this.props.patientProfile - from store
 * @prop {Function} this.props.submitData - from connect
 */

/* this component serves as a sieve for the data and pass the relevant one to the form as props*/
@withRouter
@connect(mapStateToProps)
export class VisitData extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        };
        this.references = {};
        this.originalValues = {};
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleSubmit(ev) {
        ev.preventDefault();
        const { references, originalValues } = this;
        const update = {};
        const add = {};
        Object.entries(references).forEach(el => {
            console.log(el, el[0], el[1]);
            const fieldId = el[0];
            const reference = el[1].ref;
            const type = el[1].type;
            if (type === 'C' && (originalValues[fieldId] || reference.current.value !== 'unselected')) {
                if (originalValues[fieldId] && originalValues[fieldId] !== reference.current.value) {
                    update[fieldId] = reference.current.value;
                }
                if (!originalValues[fieldId]) {
                    add[fieldId] = reference.current.value;
                }
            }
            if (['I', 'F', 'T'].includes(type) && (originalValues[fieldId] || reference.current.value !== '' || reference.current.value !== undefined)) {
                if (originalValues[fieldId] && originalValues[fieldId] !== reference.current.value) {
                    update[fieldId] = reference.current.value;
                }
                if (!originalValues[fieldId]) {
                    add[fieldId] = reference.current.value;
                }
            }
            if (type === 'B') {
                const bool = reference.current.checked ? '1' : '0';
                if (originalValues[fieldId]) {
                    if (originalValues[fieldId] !== bool) {
                        update[fieldId] = bool;
                    }
                } else {
                    if (bool !== '0') {
                        add[fieldId] = bool;
                    }
                }
            }
        });
        const { params } = this.props.match;
        const body = { data: { visitId: params.visitId, update, add }, type: 'visit', patientId: params.patientId };
        store.dispatch(alterDataCall(body));
    }

    render() {
        const { patientProfile, match } = this.props;
        const { params } = match;
        if (!patientProfile.fetching) {
            const visitsMatched = patientProfile.data.visits.filter(visit => visit.id === parseInt(params.visitId, 10));
            if (visitsMatched.length !== 1) {
                return <div>{'Cannot find your visit!'}</div>;
            }
            const { fields } = this.props;
            const relevantFields = fields.visitFields.filter(el => (el.referenceType === visitsMatched[0].type && [2, 3].includes(el.section)));
            const fieldTree = { symptoms: createLevelObj(example.filter(el => el.section === 2)), signs: createLevelObj(example.filter(el => el.section === 3)) };
            const inputTypeHash = fields.inputTypes.reduce((a, el) => { a[el.id] = el.value; return a; }, {});

            this.originalValues = visitsMatched[0].data.reduce((a, el) => { a[el.field] = el.value; return a; }, {});
            //this.references = relevantFields
            this.references = example.reduce((a, el) => { a[el.id] = { ref: React.createRef(), type: inputTypeHash[el.type] }; return a; }, {});
            return (
                <>
                    <div className={scaffold_style.ariane}>
                        <h2>SYMPTOMS AND SIGNS</h2>
                        <BackButton to={`/patientProfile/${match.params.patientId}`} />
                    </div>
                    <div className={scaffold_style.panel}>
                        <form onSubmit={this._handleSubmit} className={style.form}>
                            {Object.entries(fieldTree).map(mappingFields(inputTypeHash, this.references, this.originalValues))}
                            <input type='submit' value='Save' />
                        </form>
                    </div>
                </>
            );
        } else {
            return <div><Icon symbol='loading' /></div>;
        }
    }
}